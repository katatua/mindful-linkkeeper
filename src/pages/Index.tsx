
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SearchBar } from "@/components/SearchBar";
import { ViewToggle } from "@/components/ViewToggle";
import { LinkCard } from "@/components/LinkCard";
import { Plus } from "lucide-react";

// Sample data
const links = [
  {
    id: 1,
    title: "React Documentation",
    url: "https://react.dev",
    tags: ["react", "documentation"],
    date: "2024-03-15",
  },
  {
    id: 2,
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    tags: ["css", "styling"],
    date: "2024-03-14",
  },
  {
    id: 3,
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/",
    tags: ["typescript", "documentation"],
    date: "2024-03-13",
  },
];

const Index = () => {
  const [isGrid, setIsGrid] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-semibold text-gray-900">My Links</h1>
              </div>
              <div className="flex items-center gap-4">
                <SearchBar onSearch={setSearchQuery} />
                <ViewToggle isGrid={isGrid} onToggle={() => setIsGrid(!isGrid)} />
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <Plus className="h-4 w-4" />
                  Add Link
                </button>
              </div>
            </div>

            <div
              className={`grid gap-4 animate-fade-in ${
                isGrid ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : ""
              }`}
            >
              {filteredLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  title={link.title}
                  url={link.url}
                  tags={link.tags}
                  date={link.date}
                  isGrid={isGrid}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
