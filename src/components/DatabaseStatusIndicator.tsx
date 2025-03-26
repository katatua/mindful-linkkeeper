
import { Button } from "@/components/ui/button";
import { Database, WifiOff, Wifi } from "lucide-react";
import { toast } from "sonner";
import { useQueryProcessor } from "@/hooks/useQueryProcessor";

export const DatabaseStatusIndicator = () => {
  const { useOfflineMode, toggleOfflineMode } = useQueryProcessor();
  
  const handleToggle = () => {
    const newMode = toggleOfflineMode();
    toast.info(newMode ? "Using local file data" : "Using local database", {
      description: newMode 
        ? "Responses will use dummy data without database access" 
        : "Responses will query the local file database"
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
            Memory-Only Mode
          </>
        ) : (
          <>
            <Database className="h-3.5 w-3.5" />
            Local DB Mode
          </>
        )}
      </Button>
      <span className="text-xs text-gray-500">
        {useOfflineMode ? "Using in-memory data" : "Using local file database"}
      </span>
    </div>
  );
};

export default DatabaseStatusIndicator;
