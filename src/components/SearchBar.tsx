
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`relative transition-all duration-300 ${
        focused ? "w-96" : "w-80"
      }`}
    >
      <div
        className={`absolute inset-y-0 left-3 flex items-center pointer-events-none transition-opacity ${
          focused ? "opacity-100" : "opacity-60"
        }`}
      >
        <Search className="h-4 w-4 text-gray-500" />
      </div>
      <input
        type="text"
        placeholder="Search links..."
        onChange={(e) => onSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
      />
    </div>
  );
};
