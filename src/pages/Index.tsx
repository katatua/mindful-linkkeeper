
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SearchBar } from "@/components/SearchBar";
import { ViewToggle } from "@/components/ViewToggle";
import { LinkCard } from "@/components/LinkCard";
import { AddLinkDialog } from "@/components/AddLinkDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Link {
  id: number;
  title: string;
  url: string;
  tags: string[];
  date: string;
  file?: File;
  fileName?: string;
  classification?: string;
}

// Sample initial data
const initialLinks = [
  {
    id: 1,
    title: "React Documentation",
    url: "https://react.dev",
    tags: ["react", "documentation"],
    date: "2024-03-15",
    classification: "documentation"
  },
  {
    id: 2,
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    tags: ["css", "styling"],
    date: "2024-03-14",
    classification: "tutorial"
  },
  {
    id: 3,
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/",
    tags: ["typescript", "documentation"],
    date: "2024-03-13",
    classification: "documentation"
  },
];

const Index = () => {
  const [isGrid, setIsGrid] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const { toast } = useToast();

  const handleAddLink = async (newLink: {
    title: string;
    url: string;
    tags: string[];
    file?: File;
  }) => {
    try {
      // Get classification from Edge Function
      const { data: classificationData, error: classificationError } = await supabase.functions.invoke(
        'classify-document',
        {
          body: {
            title: newLink.title,
            fileName: newLink.file?.name
          }
        }
      );

      if (classificationError) {
        console.error('Classification error:', classificationError);
        throw new Error('Failed to classify document');
      }

      const link: Link = {
        id: links.length + 1,
        ...newLink,
        fileName: newLink.file?.name,
        date: new Date().toISOString().split("T")[0],
        classification: classificationData.classification
      };

      setLinks([link, ...links]);
      toast({
        title: "Link added successfully",
        description: `${link.title} has been added to your links.`,
      });
    } catch (error) {
      console.error('Error adding link:', error);
      toast({
        title: "Error adding link",
        description: "Failed to classify and add the link. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (link.classification && link.classification.toLowerCase().includes(searchQuery.toLowerCase()))
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
                <AddLinkDialog onAddLink={handleAddLink} />
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
                  fileName={link.fileName}
                  classification={link.classification}
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
