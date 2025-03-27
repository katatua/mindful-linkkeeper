
import React from 'react';
import { Header } from './Header';
import { AppSidebar } from './AppSidebar';
import { useSidebar } from '@/contexts/SidebarContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className={`flex-1 overflow-auto transition-all ${isOpen ? 'ml-64' : 'ml-0'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
