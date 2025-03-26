
import { Button } from "@/components/ui/button";
import { Database, WifiOff, Wifi } from "lucide-react";
import { toast } from "sonner";
import { useQueryProcessor } from "@/hooks/useQueryProcessor";

export const DatabaseStatusIndicator = () => {
  const { useOfflineMode, toggleOfflineMode } = useQueryProcessor();
  
  const handleToggle = () => {
    const newMode = toggleOfflineMode();
    toast.info(newMode ? "Using offline data" : "Using online database", {
      description: newMode 
        ? "Responses will use local dummy data" 
        : "Responses will query the Supabase database"
    });
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant={useOfflineMode ? "outline" : "default"}
        size="sm"
        onClick={handleToggle}
        className="flex items-center gap-1.5 text-xs"
      >
        {useOfflineMode ? (
          <>
            <WifiOff className="h-3.5 w-3.5" />
            Offline Mode
          </>
        ) : (
          <>
            <Wifi className="h-3.5 w-3.5" />
            Online Mode
          </>
        )}
      </Button>
      <span className="text-xs text-gray-500">
        {useOfflineMode ? "Using dummy data" : "Using database"}
      </span>
    </div>
  );
};
