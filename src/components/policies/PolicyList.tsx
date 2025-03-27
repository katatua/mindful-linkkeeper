
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Eye, ArrowUpRight, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PolicyListProps {
  searchQuery: string;
}

export const PolicyList = ({ searchQuery }: PolicyListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [policyToDownload, setPolicyToDownload] = useState<string | null>(null);
  const { t, language } = useLanguage();
  
  // Sample data for policies with translations
  const policiesEN = [
    {
      id: "POL-2023-001",
      title: "Digital Innovation Incentives",
      description: "Policy framework for incentivizing digital transformation and innovation across sectors.",
      category: "Digital Transformation",
      status: "Active",
      effectiveDate: "Jan 15, 2023",
      reviewDate: "Jan 15, 2024",
      framework: "ENEI 2030"
    },
    {
      id: "POL-2023-002",
      title: "R&D Tax Credit Enhancement",
      description: "Extended tax benefits for companies investing in research and development activities.",
      category: "R&D Funding",
      status: "Active",
      effectiveDate: "Mar 1, 2023",
      reviewDate: "Mar 1, 2024",
      framework: "ENEI 2030"
    },
    {
      id: "POL-2023-003",
      title: "Startup Ecosystem Support",
      description: "Comprehensive policy for nurturing the startup ecosystem and entrepreneurship.",
      category: "Entrepreneurship",
      status: "Active",
      effectiveDate: "Feb 10, 2023",
      reviewDate: "Feb 10, 2024",
      framework: "Startup Portugal+"
    },
    {
      id: "POL-2023-004",
      title: "Academia-Industry Collaboration",
      description: "Framework for enhancing knowledge transfer between academic institutions and industry.",
      category: "Knowledge Transfer",
      status: "Pending Review",
      effectiveDate: "Apr 5, 2023",
      reviewDate: "Jul 30, 2023",
      framework: "ENEI 2030"
    },
    {
      id: "POL-2022-015",
      title: "Green Innovation Initiatives",
      description: "Policy measures to promote and support sustainable and environmental innovation.",
      category: "Sustainability",
      status: "Under Revision",
      effectiveDate: "Nov 20, 2022",
      reviewDate: "Aug 15, 2023",
      framework: "Green Deal Portugal"
    },
    {
      id: "POL-2022-012",
      title: "International Innovation Partnerships",
      description: "Guidelines for establishing and maintaining international innovation collaborations.",
      category: "International Relations",
      status: "Active",
      effectiveDate: "Oct 1, 2022",
      reviewDate: "Oct 1, 2023",
      framework: "EU Partnership Program"
    }
  ];
  
  const policiesPT = [
    {
      id: "POL-2023-001",
      title: "Incentivos à Inovação Digital",
      description: "Quadro político para incentivar a transformação digital e a inovação em todos os setores.",
      category: "Transformação Digital",
      status: "Ativo",
      effectiveDate: "15 Jan, 2023",
      reviewDate: "15 Jan, 2024",
      framework: "ENEI 2030"
    },
    {
      id: "POL-2023-002",
      title: "Melhoria do Crédito Fiscal para I&D",
      description: "Benefícios fiscais estendidos para empresas que investem em atividades de pesquisa e desenvolvimento.",
      category: "Financiamento de I&D",
      status: "Ativo",
      effectiveDate: "1 Mar, 2023",
      reviewDate: "1 Mar, 2024",
      framework: "ENEI 2030"
    },
    {
      id: "POL-2023-003",
      title: "Apoio ao Ecossistema de Startups",
      description: "Política abrangente para nutrir o ecossistema de startups e o empreendedorismo.",
      category: "Empreendedorismo",
      status: "Ativo",
      effectiveDate: "10 Fev, 2023",
      reviewDate: "10 Fev, 2024",
      framework: "Startup Portugal+"
    },
    {
      id: "POL-2023-004",
      title: "Colaboração Academia-Indústria",
      description: "Estrutura para melhorar a transferência de conhecimento entre instituições académicas e indústria.",
      category: "Transferência de Conhecimento",
      status: "Revisão Pendente",
      effectiveDate: "5 Abr, 2023",
      reviewDate: "30 Jul, 2023",
      framework: "ENEI 2030"
    },
    {
      id: "POL-2022-015",
      title: "Iniciativas de Inovação Verde",
      description: "Medidas políticas para promover e apoiar a inovação sustentável e ambiental.",
      category: "Sustentabilidade",
      status: "Em Revisão",
      effectiveDate: "20 Nov, 2022",
      reviewDate: "15 Ago, 2023",
      framework: "Green Deal Portugal"
    },
    {
      id: "POL-2022-012",
      title: "Parcerias Internacionais de Inovação",
      description: "Diretrizes para estabelecer e manter colaborações internacionais de inovação.",
      category: "Relações Internacionais",
      status: "Ativo",
      effectiveDate: "1 Out, 2022",
      reviewDate: "1 Out, 2023",
      framework: "Programa de Parceria UE"
    }
  ];
  
  // Select policies based on current language
  const policies = language === 'en' ? policiesEN : policiesPT;
  
  const filteredPolicies = policies.filter(policy => 
    policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.framework.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPolicy = (policyId: string) => {
    // Use navigate instead of direct location change to prevent full page reload
    navigate(`/policies/${policyId}`);
  };

  const handleDownloadPolicy = (policyId: string) => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '/sample-policy.pdf'; // In real app, this would be a dynamic URL
    link.download = `Policy-${policyId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: t('policy.download.success'),
      description: `${policyId} ${t('policy.download.description.success')}`,
    });
    setPolicyToDownload(null);
  };

  if (filteredPolicies.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">{t('policy.notfound')}</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusVariant = (status: string) => {
    if (language === 'en') {
      return status === 'Active' ? 'default' : 
             status === 'Under Revision' ? 'outline' : 
             'secondary';
    } else {
      return status === 'Ativo' ? 'default' : 
             status === 'Em Revisão' ? 'outline' : 
             'secondary';
    }
  };

  return (
    <div className="space-y-4">
      {filteredPolicies.map((policy) => (
        <Card 
          key={policy.id} 
          className="hover:shadow-md transition-all cursor-pointer"
          onClick={() => handleViewPolicy(policy.id)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-medium">{policy.title}</CardTitle>
              <Badge variant={getStatusVariant(policy.status)}>
                {policy.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{policy.description}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <FileText className="h-4 w-4" />
                <span>{t('policy.category')}: {policy.category}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{t('policy.effective')}: {policy.effectiveDate}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{t('policy.review')}: {policy.reviewDate}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between items-center">
            <span className="text-xs text-gray-500">{t('policy.framework')}: {policy.framework}</span>
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" onClick={(e) => {
                e.stopPropagation();
                handleViewPolicy(policy.id);
              }}>
                <Eye className="h-4 w-4 mr-1" /> {t('policy.view')}
              </Button>
              <Dialog open={policyToDownload === policy.id} onOpenChange={(open) => {
                if (!open) setPolicyToDownload(null);
              }}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setPolicyToDownload(policy.id);
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" /> {t('policy.download')}
                  </Button>
                </DialogTrigger>
                <DialogContent onClick={(e) => e.stopPropagation()}>
                  <DialogHeader>
                    <DialogTitle>{t('policy.download.title')}</DialogTitle>
                    <DialogDescription>{t('policy.download.description')}</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p>{t('policy.download.question')} {policy.title}?</p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setPolicyToDownload(null)}>{t('policy.download.cancel')}</Button>
                    <Button onClick={() => handleDownloadPolicy(policy.id)}>{t('policy.download.confirm')}</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewPolicy(policy.id);
                }}
              >
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
