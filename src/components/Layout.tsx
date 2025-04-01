
import React, { useState } from "react";
import { Header } from "./Header";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-end mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Ferramentas <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/predictive-models")}>
                  Modelos Preditivos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/analytics")}>
                  Painel de Análises
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/reports")}>
                  Relatórios
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};
