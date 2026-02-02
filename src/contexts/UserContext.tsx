import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types/user';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole) => void;
  isOnboarded: boolean;
  completeOnboarding: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const setRole = (role: UserRole) => {
    setUser(prev => prev ? { ...prev, role } : {
      id: '1',
      name: 'User',
      email: 'user@adda247.com',
      role,
    });
  };

  const completeOnboarding = () => {
    setIsOnboarded(true);
  };

  return (
    <UserContext.Provider value={{ user, setUser, setRole, isOnboarded, completeOnboarding }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
