
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, UserPlus, LogIn, User, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) => 
    `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
      isActive(path) 
        ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-600' 
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <aside className="w-64 bg-white shadow-lg fixed h-full pt-20">
      <nav className="p-4 space-y-2">
        <Link to="/" className={linkClass('/')}>
          <Home size={20} />
          <span>Home</span>
        </Link>

        {!user ? (
          <>
            <Link to="/register" className={linkClass('/register')}>
              <UserPlus size={20} />
              <span>Registrati</span>
            </Link>
            <Link to="/login" className={linkClass('/login')}>
              <LogIn size={20} />
              <span>Accedi</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className={linkClass('/profile')}>
              <User size={20} />
              <span>Il mio profilo</span>
            </Link>
            <div className="pt-2">
              <div className="flex items-center space-x-3 p-3 text-gray-600">
                <TrendingUp size={20} />
                <span className="text-sm">Imposta offerta massima (THR)</span>
              </div>
            </div>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
