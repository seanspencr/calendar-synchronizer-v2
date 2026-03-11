import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StorageService } from '../services/storageService';

interface User {
  email: string;
  username : string;
  userid: string;
  accessToken: string | null;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    async function loadUser() {
      try {
        const [userInfo, accessToken] = await Promise.all([
          StorageService.getUserInfo(),
          StorageService.getAccessToken(),
        ]);

        if (userInfo && accessToken) {
          setUser({ ...userInfo, accessToken, userid: '' });
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (userData: User) => {
    await StorageService.saveAccessToken(userData.accessToken);
    await StorageService.saveUserInfo({
      email: userData.email,
      givenName: userData.givenName,
      familyName: userData.familyName,
    });
    setUser(userData);
  };

  const logout = async () => {
    await StorageService.clearAll();
    setUser(null);
  };

  const value: UserContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
}