
import React, { useEffect, useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { TrendingUp, Clock, Euro } from 'lucide-react';

const Home: React.FC = () => {
  const { bid, bidder, fetchAuctionData } = useAuction();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Aggiorna i dati ogni 5 secondi
    const interval = setInterval(() => {
      fetchAuctionData();
      setLastUpdate(new Date());
    }, 5000);

    // Fetch iniziale
    fetchAuctionData();

    return () => clearInterval(interval);
  }, [fetchAuctionData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Asta Online - Stato Attuale
        </h1>
        <p className="text-gray-600">
          Benvenuto nel sistema di asta online. Qui puoi vedere l'offerta attuale in tempo reale.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Euro className="text-green-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Offerta Attuale (BID)
              </h2>
              <p className="text-sm text-gray-600">
                Valore più alto dell'asta
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {formatCurrency(bid)}
            </div>
            <div className="text-sm text-gray-500">
              Ultimo aggiornamento: {lastUpdate.toLocaleTimeString('it-IT')}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Offerente Attuale
              </h2>
              <p className="text-sm text-gray-600">
                Chi ha l'offerta più alta
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600 mb-2">
              {bidder || "Ancora nessuna offerta effettuata."}
            </div>
            {bidder && (
              <div className="text-sm text-gray-500">
                Detentore dell'offerta vincente
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Clock className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              Come funziona l'asta
            </h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Registrati per partecipare all'asta</li>
              <li>• Imposta la tua offerta massima (THR) nel tuo profilo</li>
              <li>• Il sistema calcola automaticamente l'offerta vincente</li>
              <li>• L'offerta viene aggiornata in tempo reale ogni 5 secondi</li>
              <li>• Vince chi ha l'offerta massima più alta</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
