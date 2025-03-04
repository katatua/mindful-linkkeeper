
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HamburgerMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px]">
        <div className="flex flex-col gap-4 py-4">
          <div 
            className="flex items-center gap-2 pb-4 border-b cursor-pointer" 
            onClick={() => handleNavigation("/")}
          >
            <img 
              src="https://via.placeholder.com/40?text=ANI" 
              alt="ANI Logo" 
              className="h-8 w-8 rounded" 
            />
            <span className="font-medium">GenAI Innovation Data Space</span>
          </div>
          
          <div className="space-y-3 pt-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/funding")}
            >
              Funding
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/projects")}
            >
              Projects
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/analytics")}
            >
              Analytics
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/reports")}
            >
              Reports
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/policies")}
            >
              Policies
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/add-file")}
            >
              Upload File
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/add-link")}
            >
              Add Link
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/add-category")}
            >
              Add Category
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
