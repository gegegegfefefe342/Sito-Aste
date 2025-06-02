
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAuction } from '../context/AuctionContext';
import { User, TrendingUp, Euro, AlertCircle, CheckCircle, Crown } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { bid, bidder, userThr, setUserThr, statusMessage, statusType } = useAuction();
  const [thrInput, setThrInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userThr) {
      setThrInput(userThr.toFixed(2));
    }
  }, [userThr]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const validateThr = (value: string): boolean => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      setError('Inserisci un valore numerico valido');
      return false;
    }

    if (numValue <= 0) {
      setError('Il valore deve essere maggiore di 0');
      return false;
    }

    // Controlla che sia multiplo di 0.01
    if (Math.round(numValue * 100) !== numValue * 100) {
      setError('Il valore deve essere multiplo di 0,01 €');
      return false;
    }

    if (numValue <= bid) {
      setError(`Offerta troppo bassa: il tuo THR deve essere maggiore di ${formatCurrency(bid)}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateThr(thrInput)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const thrValue = parseFloat(thrInput);
      await setUserThr(thrValue);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWinning = bidder === user.email;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Il mio profilo
        </h1>
        <p className="text-gray-600">
          Gestisci la tua offerta massima e monitora lo stato dell'asta
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Informazioni utente */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <User className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Informazioni Account
              </h2>
              <p className="text-sm text-gray-600">
                I tuoi dati personali
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            
            {isWinning && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <Crown size={20} />
                <span className="font-medium">Sei il massimo offerente!</span>
              </div>
            )}
          </div>
        </div>

        {/* Stato asta */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Stato Asta
              </h2>
              <p className="text-sm text-gray-600">
                Informazioni attuali
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">BID Attuale</label>
              <p className="text-xl font-bold text-green-600">{formatCurrency(bid)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Offerente Attuale</label>
              <p className="text-gray-900">{bidder || "Nessuna offerta"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* THR Form */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <div className="bg-purple-100 p-3 rounded-lg mr-4">
            <Euro className="text-purple-600" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Imposta Offerta Massima (THR)
            </h2>
            <p className="text-sm text-gray-600">
              Imposta il valore massimo che sei disposto a offrire
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className={`mb-4 p-4 rounded-lg ${
            statusType === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`flex items-center text-sm ${
              statusType === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {statusType === 'success' ? (
                <CheckCircle size={16} className="mr-2" />
              ) : (
                <AlertCircle size={16} className="mr-2" />
              )}
              {statusMessage}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-700 text-sm">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          </div>
        )}

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <strong>THR attuale:</strong> {userThr ? formatCurrency(userThr) : "Non hai ancora impostato un valore massimo."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="thr" className="block text-sm font-medium text-gray-700 mb-2">
              Nuovo valore THR (€)
            </label>
            <input
              type="number"
              id="thr"
              value={thrInput}
              onChange={(e) => setThrInput(e.target.value)}
              step="0.01"
              min="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={`Imposta un valore maggiore di ${formatCurrency(bid)}. Solo multipli di 0,01.`}
              title={`Imposta un valore maggiore di ${formatCurrency(bid)}. Solo multipli di 0,01.`}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Il valore deve essere maggiore dell'attuale BID ({formatCurrency(bid)}) e multiplo di 0,01 €
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Aggiornamento...' : 'Aggiorna THR'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
