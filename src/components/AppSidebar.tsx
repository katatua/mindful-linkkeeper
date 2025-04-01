
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
import { Menu, MoonIcon, SunIcon, MessageCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { DatabaseIcon, Search } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";

// Use next-themes for theme management
import { useTheme } from "next-themes"

export function AppSidebar() {
  const { pathname } = useLocation();
  const { setTheme, resolvedTheme } = useTheme();
  const { t } = useLanguage();

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
            {t('sidebar.menu')}
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
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              data-active={pathname === '/assistant'}
            >
              <Link to="/assistant">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t('assistant')}
              </Link>
            </Button>
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {t('sidebar.database')}
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
                {t('sidebar.explorer')}
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
                {t('sidebar.query')}
              </Link>
            </Button>
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {t('sidebar.admin')}
          </h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              data-active={pathname === '/admin/settings'}
            >
              <Link to="/admin/settings">
                {t('sidebar.settings')}
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
            <SheetTitle>{t('sidebar.menu')}</SheetTitle>
            <SheetDescription>
              {t('sidebar.description')}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {t('sidebar.menu')}
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
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  data-active={pathname === '/assistant'}
                >
                  <Link to="/assistant">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t('assistant')}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {t('sidebar.database')}
              </h2>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  data-active={pathname === '/database'}
                >
                  <Link to="/database">
                    {t('sidebar.explorer')}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  data-active={pathname === '/query-assistant'}
                >
                  <Link to="/query-assistant">
                    {t('sidebar.query')}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {t('sidebar.admin')}
              </h2>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  data-active={pathname === '/admin/settings'}
                >
                  <Link to="/admin/settings">
                    {t('sidebar.settings')}
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
