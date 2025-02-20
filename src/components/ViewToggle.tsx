
import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
  isGrid: boolean;
  onToggle: () => void;
}

export const ViewToggle = ({ isGrid, onToggle }: ViewToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Toggle view"
    >
      {isGrid ? (
        <List className="h-5 w-5 text-gray-600" />
      ) : (
        <LayoutGrid className="h-5 w-5 text-gray-600" />
      )}
    </button>
  );
};
