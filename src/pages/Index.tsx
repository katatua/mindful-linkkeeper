
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
  id: string;
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

interface LinkSummary {
  total: number;
  byClassification: { [key: string]: number };
  recentlyAdded: number;
}

const Index = () => {
  const [isGrid, setIsGrid] = useState(false); // Set default to false for row list
  const [searchQuery, setSearchQuery] = useState("");
  const [links, setLinks] = useState<Link[]>([]);
  const [summary, setSummary] = useState<LinkSummary>({
    total: 0,
    byClassification: {},
    recentlyAdded: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    // Update summary whenever links change
    const today = new Date();
    const last24Hours = new Date(today.getTime() - (24 * 60 * 60 * 1000));

    const summaryData: LinkSummary = {
      total: links.length,
      byClassification: {},
      recentlyAdded: links.filter(link => new Date(link.date) >= last24Hours).length
    };

    links.forEach(link => {
      if (link.classification) {
        summaryData.byClassification[link.classification] = 
          (summaryData.byClassification[link.classification] || 0) + 1;
      }
    });

    setSummary(summaryData);
  }, [links]);

  const fetchLinks = async () => {
    try {
      const { data: linksData, error } = await supabase
        .from('links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (linksData) {
        const formattedLinks: Link[] = linksData.map(link => ({
          id: link.id,
          title: link.title || '',
          url: link.url || '#',
          tags: [], // Since we don't have tags in the database yet, initialize as empty array
          date: new Date(link.created_at || '').toLocaleDateString(),
          file_metadata: link.file_metadata as Link['file_metadata'],
          classification: link.classification || ''
        }));
        setLinks(formattedLinks);
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

            {/* Summary Section */}
            <div className="mb-8 grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Links</h3>
                <p className="text-2xl font-semibold text-gray-900">{summary.total}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Added (24h)</h3>
                <p className="text-2xl font-semibold text-gray-900">{summary.recentlyAdded}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">By Classification</h3>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(summary.byClassification).map(([classification, count]) => (
                    <span key={classification} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {classification}: {count}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Links List */}
            <div className="space-y-4">
              {filteredLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  title={link.title}
                  url={link.url}
                  tags={link.tags}
                  date={link.date}
                  fileName={link.file_metadata?.name}
                  classification={link.classification}
                  isGrid={false}
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
