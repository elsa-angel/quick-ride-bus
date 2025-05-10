import { Box, Container } from '@mui/material';
import { createContext, useState, useContext, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import axiosInstance from 'src/api/axios-instance';
import { useRouter } from 'src/routes/hooks';

// Define the context type
interface AuthContextType {
  authUser: IAuthUser | null;
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
  isSuperUser: boolean;
}

// Create a provider component to wrap around the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<IAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    axiosInstance
      .get('/auth-check')
      .then((response) => {
        if (isMounted) setAuthUser(response.data);
        setSessionExpired(false);
        if (window.location.href.endsWith('/sign-in')) {
          router.push('/');
        }
      })
      .catch(() => {
        if (isMounted) {
          if (authUser?.isAuthenticated) setSessionExpired(true);
          else setAuthUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [router, authUser?.isAuthenticated]);

  const contextValue = useMemo(() => ({ authUser, setAuthUser }), [authUser]);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          {/* <PulsatingDots /> */}
          Loading...
        </Box>
      </Container>
    );
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
