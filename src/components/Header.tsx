
import React from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Database } from 'lucide-react';

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative">
      {children}
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className={navigationMenuTriggerStyle()}>
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/projects" className={navigationMenuTriggerStyle()}>
                  Projects
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/policies" className={navigationMenuTriggerStyle()}>
                  Policies
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/analytics" className={navigationMenuTriggerStyle()}>
                  Analytics
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/database" className={navigationMenuTriggerStyle()}>
                  <Database className="mr-2 h-4 w-4" />
                  Database
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/add-file">Upload</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
