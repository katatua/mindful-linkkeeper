
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AddFile from "./pages/AddFile";
import AddLink from "./pages/AddLink";
import AddCategory from "./pages/AddCategory";
import ANIPortal from "./pages/ANIPortal";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import FundingPage from "./pages/FundingPage";
import ProjectsPage from "./pages/ProjectsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ANIPortal />} />
          <Route path="/legacy" element={<Index />} />
          <Route path="/add-file" element={<AddFile />} />
          <Route path="/add-link" element={<AddLink />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/funding" element={<FundingPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
