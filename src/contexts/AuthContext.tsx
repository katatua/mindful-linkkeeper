
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  isLoggedIn: boolean;
  user: any | null; // Add user information
  login: () => void;
  logout: () => Promise<void>;
};

const defaultAuthContext: AuthContextType = {
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: async () => {}
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  // Check initial auth state
  useEffect(() => {
    let isMounted = true;
    
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (isMounted) {
          setIsLoggedIn(!!session);
          setUser(session?.user || null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (isMounted) {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsLoggedIn(!!session);
        setUser(session?.user || null);
      }
    });

    // Cleanup function to unsubscribe and prevent state updates on unmounted component
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    isLoggedIn,
    user,
    login,
    logout
  }), [isLoggedIn, user, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
