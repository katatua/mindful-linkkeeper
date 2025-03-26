
import React, { createContext, useContext, ReactNode } from 'react';
import { localDatabase } from '@/utils/localDatabase';
import { mockClient } from '@/integrations/supabase/mockClient';

// Create a context for the local database
const LocalDatabaseContext = createContext({
  supabase: mockClient,
  isUsingLocalDb: true,
});

// Context hook
export const useLocalDatabase = () => useContext(LocalDatabaseContext);

interface LocalDatabaseProviderProps {
  children: ReactNode;
}

export const LocalDatabaseProvider: React.FC<LocalDatabaseProviderProps> = ({ children }) => {
  return (
    <LocalDatabaseContext.Provider value={{ supabase: mockClient, isUsingLocalDb: true }}>
      {children}
    </LocalDatabaseContext.Provider>
  );
};
