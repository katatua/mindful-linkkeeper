
import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { HamburgerMenu } from './HamburgerMenu';

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-4">
          <HamburgerMenu />
          <span className="font-semibold text-lg">ANI Portal</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/add-file">Upload</Link>
          </Button>
        </div>
      </div>
      {children}
    </header>
  );
}
