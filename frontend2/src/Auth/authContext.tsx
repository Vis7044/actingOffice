import { createContext,  useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { fetchUser } from './userService';
import type { User } from '../types/authTypes';

interface IAuthContext {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    const userDetails = await fetchUser();
    setUser(userDetails);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      fetchUser().then(setUser).catch(() => logout());
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



