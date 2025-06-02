
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  sessionExpired: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  const SESSION_TIMEOUT = 2 * 60 * 1000; // 2 minuti in millisecondi

  // Simulazione di storage (in un'app reale userei localStorage/sessionStorage)
  const [users, setUsers] = useState<{ [email: string]: { passwordHash: string } }>({});

  const hashPassword = (password: string): string => {
    // Simulazione di hash (in produzione usare bcrypt)
    return btoa(password + 'salt');
  };

  const checkSession = () => {
    if (user && Date.now() - lastActivity > SESSION_TIMEOUT) {
      setUser(null);
      setSessionExpired(true);
      localStorage.removeItem('user');
      return false;
    }
    return true;
  };

  const updateActivity = () => {
    setLastActivity(Date.now());
    if (sessionExpired) {
      setSessionExpired(false);
    }
  };

  useEffect(() => {
    // Recupera utente da localStorage
    const savedUser = localStorage.getItem('user');
    const savedActivity = localStorage.getItem('lastActivity');
    
    if (savedUser && savedActivity) {
      const activityTime = parseInt(savedActivity);
      if (Date.now() - activityTime < SESSION_TIMEOUT) {
        setUser(JSON.parse(savedUser));
        setLastActivity(activityTime);
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('lastActivity');
      }
    }

    // Carica utenti dal localStorage (simulazione database)
    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const interval = setInterval(checkSession, 10000); // Controlla ogni 10 secondi
      return () => clearInterval(interval);
    }
  }, [user, lastActivity]);

  useEffect(() => {
    // Salva attività dell'utente
    const handleActivity = () => {
      if (user) {
        updateActivity();
        localStorage.setItem('lastActivity', Date.now().toString());
      }
    };

    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [user]);

  const register = async (email: string, password: string): Promise<void> => {
    if (users[email]) {
      throw new Error('Email già registrata');
    }

    const newUsers = {
      ...users,
      [email]: {
        passwordHash: hashPassword(password)
      }
    };

    setUsers(newUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(newUsers));
  };

  const login = async (email: string, password: string): Promise<void> => {
    if (sessionExpired) {
      throw new Error('Sessione scaduta per inattività: effettua nuovamente l\'accesso.');
    }

    const userData = users[email];
    if (!userData || userData.passwordHash !== hashPassword(password)) {
      throw new Error('Email o password non corretti');
    }

    const newUser = { email };
    setUser(newUser);
    updateActivity();
    
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('lastActivity', Date.now().toString());
  };

  const logout = () => {
    setUser(null);
    setSessionExpired(false);
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    sessionExpired
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
