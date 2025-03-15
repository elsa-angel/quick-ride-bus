import { createContext, useState, useContext, ReactNode } from 'react';

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

  return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};
