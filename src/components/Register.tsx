
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLetter && hasNumber;
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!email) {
      newErrors.push('L\'email è obbligatoria');
    } else if (!validateEmail(email)) {
      newErrors.push('Inserisci un\'email valida');
    }

    if (!password) {
      newErrors.push('La password è obbligatoria');
    } else if (!validatePassword(password)) {
      newErrors.push('La password deve contenere almeno una lettera e un numero');
    }

    if (password !== confirmPassword) {
      newErrors.push('Le password non coincidono');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register(email, password);
      setSuccess('Registrazione completata con successo!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setErrors([error as string]);
    }
  };

  const getPasswordHelp = () => {
    if (!password) return '';
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (hasLetter && hasNumber) {
      return 'Password valida';
    }
    return 'La password deve contenere almeno una lettera e un numero';
  };

  const getPasswordClass = () => {
    if (!password) return '';
    const isValid = validatePassword(password);
    return isValid ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Registrazione</h1>
          <p className="text-gray-600 mt-2">
            Crea un account per partecipare all'asta
          </p>
        </div>

        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            {errors.map((error, index) => (
              <div key={index} className="flex items-center text-red-700 text-sm">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </div>
            ))}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-700 text-sm">
              <CheckCircle size={16} className="mr-2" />
              {success}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Inserisci un'email valida"
                title="Inserisci un'email valida"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
                title="La password deve contenere almeno una lettera e un numero"
              />
            </div>
            {password && (
              <p className={`text-xs mt-1 ${getPasswordClass()}`}>
                {getPasswordHelp()}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Conferma Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Conferma password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Registrati
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Hai già un account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Accedi qui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
