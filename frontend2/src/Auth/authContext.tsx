import { createContext, useState, useEffect } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { fetchUser } from './userService';
import type { User } from '../types/authTypes';

interface IAuthContext {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
 
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // avoid flash or infinite redirects

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    const userDetails = await fetchUser();
    setUser(userDetails);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // use window.location only if not already on /login
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false); // no token, no need to fetch
      return;
    }

    fetchUser()
      .then(setUser)
      .catch(() => {
        console.warn('Invalid or expired token. Logging out.');
        logout();
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null; 

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};
