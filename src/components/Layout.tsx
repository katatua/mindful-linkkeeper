
import React from 'react';
import { Header } from './Header';
import { AppSidebar } from './AppSidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { HamburgerMenu } from './HamburgerMenu';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header>
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <HamburgerMenu />
        </div>
      </Header>
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className={`flex-1 overflow-auto transition-all ${isOpen ? 'ml-64' : 'ml-0'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
