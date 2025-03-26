
import React, { createContext, useContext, ReactNode } from 'react';
import { mockSupabase, localDatabase } from '@/utils/localDatabase';

// Create a context for the local database
const LocalDatabaseContext = createContext({
  supabase: mockSupabase,
  isUsingLocalDb: true,
});

// Context hook
export const useLocalDatabase = () => useContext(LocalDatabaseContext);

interface LocalDatabaseProviderProps {
  children: ReactNode;
}

export const LocalDatabaseProvider: React.FC<LocalDatabaseProviderProps> = ({ children }) => {
  return (
    <LocalDatabaseContext.Provider value={{ supabase: mockSupabase, isUsingLocalDb: true }}>
      {children}
    </LocalDatabaseContext.Provider>
  );
};
