import { createContext, useState, useContext, ReactNode, useMemo } from 'react';

// Define the context type
interface AuthContextType {
  authUser: IAuthUser;
  setAuthUser: Function;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export interface IAuthUser {
  isAuthenticated: boolean;
  user: {
    name: string;
    id: string;
    email: string;
  };
}

// Create a provider component to wrap around the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<IAuthUser>({
    isAuthenticated: false,
    user: {
      name: '',
      id: '',
      email: '',
    },
  });
  const value = useMemo(() => ({ authUser, setAuthUser }), [authUser, setAuthUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
