import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DocumentDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { documentId } = useParams();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching document data
    setLoading(true);
    setTimeout(() => {
      const sampleDocument = {
        id: documentId,
        title: `Document ${documentId}`,
        description: "This is a sample document description. You can add more details here.",
        category: "Research Report",
        uploadDate: "2023-01-15",
        size: "2.5 MB",
        status: "Published",
        keywords: ["innovation", "research", "policy"],
        contentUrl: "/sample-document.pdf", // URL to the actual document
      };
      setDocument(sampleDocument);
      setLoading(false);
    }, 500);

    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [documentId]);

  useEffect(() => {
    if (document?.contentUrl) {
      setPdfUrl(document.contentUrl);
    }
  }, [document]);

  const handleDownload = () => {
    toast({
      title: "Document downloaded",
      description: `${document?.title} has been downloaded successfully.`,
    });
  };

  const handleShare = () => {
    toast({
      title: "Share options",
      description: "Sharing options dialog would appear here.",
    });
  };

  const handleViewDocument = () => {
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleBackToDataSources = () => {
    // Navigate to Database page with the datasources tab active
    navigate('/database?tab=datasources');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          className="w-fit" 
          onClick={handleBackToDataSources}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Fontes de Dados
        </Button>
      </div>

      {loading ? (
        <p>Loading document details...</p>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold">{document?.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={document?.status === 'Published' ? 'default' : 'secondary'}>
                  {document?.status}
                </Badge>
                <span className="text-sm text-gray-500">ID: {document?.id}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-3 md:mt-0">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                Share
              </Button>
              <Button size="sm" onClick={handleViewDocument}>
                View Document
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Category</span>
                  <p className="text-sm">{document?.category}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Upload Date</span>
                  <p className="text-sm">{document?.uploadDate}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Size</span>
                  <p className="text-sm">{document?.size}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Document Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{document?.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Document Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Keywords</span>
                    <p className="text-sm">{document?.keywords?.join(', ') || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-5xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Document Viewer</DialogTitle>
                <DialogDescription>
                  View the full document here.
                </DialogDescription>
              </DialogHeader>
              {pdfUrl ? (
                <iframe src={pdfUrl} title="Document Viewer" width="100%" height="600px"></iframe>
              ) : (
                <p>No document available to view.</p>
              )}
              <Button onClick={handleCloseViewDialog}>Close</Button>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default DocumentDetailPage;
