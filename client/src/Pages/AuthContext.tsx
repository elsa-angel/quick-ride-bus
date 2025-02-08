import { createContext, useState, useContext, ReactNode } from "react";

// Define the context type
interface AuthContextType {
  authUser: IAuthUser;
  login: (authUser: IAuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); // Type the context

// Create a custom hook to access the context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export interface IAuthUser {
  isAuthenticated: boolean;
  name: string;
}

// Create a provider component to wrap around the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<IAuthUser>({
    isAuthenticated: false,
    name: "",
  });

  const login = (authUser: IAuthUser) => setAuthUser(authUser);
  const logout = () => setAuthUser({ isAuthenticated: false, name: "" });

  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
