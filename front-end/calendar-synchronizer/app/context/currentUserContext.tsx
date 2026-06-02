import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StorageService } from '../services/storageService';
import { LoginResponseDto } from '../api-client';

interface UserContextType {
  user: LoginResponseDto | null;
  setUser: (user: LoginResponseDto | null) => void; 
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: LoginResponseDto) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate user from storage on app start
  useEffect(() => {
    async function loadUser() {
      try {
        const [userInfo, accessToken] = await Promise.all([
          StorageService.getUserInfo(),
          StorageService.getAccessToken(),
        ]);

        if (userInfo && accessToken) {
          setUser({
            google_email: userInfo.google_email,
            microsoft_email: userInfo.microsoft_email,
            username: userInfo.username,
            userid: userInfo.userid,
            accessToken : accessToken,
          });
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (userData: LoginResponseDto) => {
    // Save to storage
    await StorageService.saveAccessToken(userData.accessToken);
    await StorageService.saveUserInfo({
      google_email: userData.google_email,
      microsoft_email: userData.microsoft_email,
      username: userData.username,
      userid: userData.userid,
      accessToken: userData.accessToken,
    });
    // Update context — this triggers the redirect in index.tsx
    setUser(userData);
  };

  const logout = async () => {
    await StorageService.clearAll();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, isAuthenticated: !!user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}