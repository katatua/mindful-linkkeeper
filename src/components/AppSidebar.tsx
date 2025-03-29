import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react";
import { useTheme } from "@/components/theme-provider"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { DatabaseIcon, Search } from 'lucide-react';

export function AppSidebar() {
  const { pathname } = useLocation();
  const { setTheme, mode } = useTheme();

  return (
    <div className="border-r flex-col bg-background md:flex hidden">
      <div className="flex h-20 shrink-0 items-center border-b bg-secondary p-4">
        <Link to="/" className="font-semibold text-2xl">
          Inovação
        </Link>
      </div>

      <div className="space-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Menu
          </h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              data-active={pathname === '/'}
            >
              <Link to="/">
                Dashboard
              </Link>
            </Button>
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Database
          </h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              data-active={pathname === '/database'}
            >
              <Link to="/database">
                <DatabaseIcon className="mr-2 h-4 w-4" />
                Database Explorer
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              data-active={pathname === '/query-assistant'}
            >
              <Link to="/query-assistant">
                <Search className="mr-2 h-4 w-4" />
                Query Assistant
              </Link>
            </Button>
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Admin
          </h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              data-active={pathname === '/admin/settings'}
            >
              <Link to="/admin/settings">
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden absolute top-4 left-4">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:w-64">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Explore the application.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Menu
              </h2>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  data-active={pathname === '/'}
                >
                  <Link to="/">
                    Dashboard
                  </Link>
                </Button>
              </div>
            </div>

            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Database
              </h2>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  data-active={pathname === '/database'}
                >
                  <Link to="/database">
                    Database Explorer
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  data-active={pathname === '/query-assistant'}
                >
                  <Link to="/query-assistant">
                    Query Assistant
                  </Link>
                </Button>
              </div>
            </div>

            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Admin
              </h2>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  data-active={pathname === '/admin/settings'}
                >
                  <Link to="/admin/settings">
                    Settings
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
