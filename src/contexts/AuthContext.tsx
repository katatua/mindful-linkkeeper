
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  isLoggedIn: boolean;
  user: any | null; // Add user information
  login: () => void;
  logout: () => void;
};

const defaultAuthContext: AuthContextType = {
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {}
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Check initial auth state
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkSession();

    // Subscribe to auth changes - store the subscription to clean it up later
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setUser(session?.user || null);
    });

    // Cleanup function to unsubscribe on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
