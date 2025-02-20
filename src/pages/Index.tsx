
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SearchBar } from "@/components/SearchBar";
import { ViewToggle } from "@/components/ViewToggle";
import { LinkCard } from "@/components/LinkCard";
import { AddLinkDialog } from "@/components/AddLinkDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Link {
  id: string;  // Changed from number to string to match Supabase UUID
  title: string;
  url: string;
  tags: string[];
  date: string;
  file_metadata?: {
    name: string;
    size: number;
    type: string;
  };
  classification?: string;
}

const Index = () => {
  const [isGrid, setIsGrid] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [links, setLinks] = useState<Link[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data: linksData, error } = await supabase
        .from('links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (linksData) {
        setLinks(linksData.map(link => ({
          id: link.id,
          title: link.title || '',
          url: link.url || '#', // Provide a fallback URL
          tags: [],
          date: new Date(link.created_at || '').toLocaleDateString(),
          file_metadata: link.file_metadata,
          classification: link.classification
        })));
      }
    } catch (error) {
      console.error('Error fetching links:', error);
      toast({
        title: "Error loading links",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleAddLink = async (newLink: {
    title: string;
    url: string;
    tags: string[];
    file?: File;
  }) => {
    try {
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

      // Generate a temporary ID (will be replaced by Supabase's UUID)
      const tempId = crypto.randomUUID();
      
      const link: Link = {
        id: tempId,
        ...newLink,
        date: new Date().toISOString().split("T")[0],
        classification: classificationData.classification
      };

      setLinks([link, ...links]);
      toast({
        title: "Link added successfully",
        description: `${link.title} has been added to your links.`,
      });
      
      // Refresh the links list to show new items
      fetchLinks();
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
      (link.file_metadata?.name && link.file_metadata.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (link.tags && link.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
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
                <SidebarTrigger className="h-10 w-10 p-2 hover:bg-gray-100 rounded-lg border border-gray-200" />
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
                  fileName={link.file_metadata?.name}
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
