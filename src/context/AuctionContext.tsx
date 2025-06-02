
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface AuctionContextType {
  bid: number;
  bidder: string | null;
  userThr: number | null;
  statusMessage: string;
  statusType: 'success' | 'error' | '';
  fetchAuctionData: () => void;
  setUserThr: (thr: number) => Promise<void>;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (context === undefined) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};

interface AuctionProviderProps {
  children: ReactNode;
}

interface UserData {
  thr: number | null;
  thrTimestamp: number;
}

interface AuctionData {
  bid: number;
  bidder: string | null;
  users: { [email: string]: UserData };
}

export const AuctionProvider: React.FC<AuctionProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [bid, setBid] = useState<number>(1.00);
  const [bidder, setBidder] = useState<string | null>(null);
  const [userThr, setUserThrState] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');

  // Simulazione database in memoria
  const getAuctionData = (): AuctionData => {
    const saved = localStorage.getItem('auctionData');
    return saved ? JSON.parse(saved) : {
      bid: 1.00,
      bidder: null,
      users: {}
    };
  };

  const saveAuctionData = (data: AuctionData) => {
    localStorage.setItem('auctionData', JSON.stringify(data));
  };

  const calculateNewBid = (users: { [email: string]: UserData }): { bid: number, bidder: string | null } => {
    const userEntries = Object.entries(users).filter(([_, userData]) => userData.thr !== null);
    
    if (userEntries.length === 0) {
      return { bid: 1.00, bidder: null };
    }

    // Ordina per THR decrescente, poi per timestamp crescente (primo vince in caso di parità)
    userEntries.sort(([emailA, dataA], [emailB, dataB]) => {
      if (dataB.thr !== dataA.thr) {
        return (dataB.thr || 0) - (dataA.thr || 0);
      }
      return dataA.thrTimestamp - dataB.thrTimestamp;
    });

    const [winnerEmail, winnerData] = userEntries[0];
    
    if (userEntries.length === 1) {
      // Solo un utente ha fatto un'offerta
      return { bid: 1.00, bidder: winnerEmail };
    }

    // Calcola BID come secondo THR più alto + 0.01
    const [, secondData] = userEntries[1];
    const newBid = Math.round(((secondData.thr || 0) + 0.01) * 100) / 100;
    
    return { bid: newBid, bidder: winnerEmail };
  };

  const fetchAuctionData = useCallback(() => {
    const data = getAuctionData();
    setBid(data.bid);
    setBidder(data.bidder);
    
    if (user && data.users[user.email]) {
      setUserThrState(data.users[user.email].thr);
    }
  }, [user]);

  const setUserThr = async (thr: number): Promise<void> => {
    if (!user) {
      throw new Error('Utente non autenticato');
    }

    const data = getAuctionData();
    
    // Verifica che THR sia maggiore di BID attuale
    if (thr <= data.bid) {
      throw new Error(`Offerta troppo bassa: il tuo THR deve essere maggiore di ${data.bid.toFixed(2)} €`);
    }

    // Aggiorna THR dell'utente
    data.users[user.email] = {
      thr: thr,
      thrTimestamp: Date.now()
    };

    // Ricalcola BID
    const { bid: newBid, bidder: newBidder } = calculateNewBid(data.users);
    data.bid = newBid;
    data.bidder = newBidder;

    // Salva dati
    saveAuctionData(data);

    // Aggiorna stato locale
    setBid(newBid);
    setBidder(newBidder);
    setUserThrState(thr);

    // Imposta messaggio di stato
    if (newBidder === user.email) {
      setStatusMessage(`Sei il massimo offerente con THR = ${thr.toFixed(2)} €.`);
      setStatusType('success');
    } else {
      setStatusMessage(`Offerta superata: attualmente il massimo offerente è ${newBidder} con BID = ${newBid.toFixed(2)} €.`);
      setStatusType('error');
    }

    // Pulisci messaggio dopo 5 secondi
    setTimeout(() => {
      setStatusMessage('');
      setStatusType('');
    }, 5000);
  };

  const value: AuctionContextType = {
    bid,
    bidder,
    userThr,
    statusMessage,
    statusType,
    fetchAuctionData,
    setUserThr
  };

  return (
    <AuctionContext.Provider value={value}>
      {children}
    </AuctionContext.Provider>
  );
};
