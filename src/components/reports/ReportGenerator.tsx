
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ReportVisualizer, extractVisualizations } from "./ReportVisualizer";
import { saveReport } from "@/utils/reportService";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const ReportGenerator = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState(language === 'pt' ? "Inovação em energia renovável" : "Innovation in renewable energy");
  const [location, setLocation] = useState(language === 'pt' ? "Portugal" : "Portugal");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [reportStyle, setReportStyle] = useState("formal");
  const [generatedReport, setGeneratedReport] = useState("");
  const [visualizations, setVisualizations] = useState<any[]>([]);

  const generateReport = async () => {
    setIsLoading(true);
    
    try {
      let reportContent = "";
      
      // Generate different types of reports based on the topic and style
      if (topic.toLowerCase().includes(language === 'pt' ? "renovável" : "renewable") || 
          topic.toLowerCase().includes(language === 'pt' ? "energia" : "energy")) {
        reportContent = language === 'pt' ? 
          generateEnergyReportPT(topic, location, year, reportStyle) :
          generateEnergyReport(topic, location, year, reportStyle);
      } else if (topic.toLowerCase().includes(language === 'pt' ? "inovação" : "innovation")) {
        reportContent = language === 'pt' ?
          generateInnovationReportPT(topic, location, year, reportStyle) :
          generateInnovationReport(topic, location, year, reportStyle);
      } else if (topic.toLowerCase().includes(language === 'pt' ? "tecnologia" : "technology") ||
                topic.toLowerCase().includes(language === 'pt' ? "digital" : "digital")) {
        reportContent = language === 'pt' ?
          generateTechnologyReportPT(topic, location, year, reportStyle) :
          generateTechnologyReport(topic, location, year, reportStyle);
      } else if (topic.toLowerCase().includes(language === 'pt' ? "política" : "policy") ||
                topic.toLowerCase().includes(language === 'pt' ? "governo" : "government")) {
        reportContent = language === 'pt' ?
          generatePolicyReportPT(topic, location, year, reportStyle) :
          generatePolicyReport(topic, location, year, reportStyle);
      } else {
        // Generic report for other topics
        reportContent = language === 'pt' ?
          generateGenericReportPT(topic, location, year, reportStyle) :
          generateGenericReport(topic, location, year, reportStyle);
      }
      
      // Extract visualizations from the report content
      const extractedVisualizations = extractVisualizations(reportContent);
      
      setGeneratedReport(reportContent);
      setVisualizations(extractedVisualizations);
      
      // Save report to the database
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      // Determine report type based on the topic
      let reportType = language === 'pt' ? "Relatório Geral" : "General Report";
      if (topic.toLowerCase().includes(language === 'pt' ? "renovável" : "renewable") || 
          topic.toLowerCase().includes(language === 'pt' ? "energia" : "energy")) {
        reportType = language === 'pt' ? "Relatório de Energia Renovável" : "Renewable Energy Report";
      } else if (topic.toLowerCase().includes(language === 'pt' ? "inovação" : "innovation")) {
        reportType = language === 'pt' ? "Relatório de Inovação" : "Innovation Report";
      } else if (topic.toLowerCase().includes(language === 'pt' ? "tecnologia" : "technology")) {
        reportType = language === 'pt' ? "Relatório Tecnológico" : "Technology Report";
      } else if (topic.toLowerCase().includes(language === 'pt' ? "política" : "policy")) {
        reportType = language === 'pt' ? "Relatório de Políticas" : "Policy Report";
      }
      
      const reportData = {
        title: `${topic} in ${location} (${year})`,
        content: reportContent,
        user_id: userId || null,
        language: language,
        metadata: { topic, location, year, reportStyle },
        chart_data: { visualizations: extractedVisualizations },
        report_type: reportType,
        file_url: null
      };
      
      await saveReport(reportData);

      toast({
        title: language === 'pt' ? "Relatório Gerado" : "Report Generated",
        description: language === 'pt' ? 
          `Seu relatório sobre ${topic} em ${location} para ${year} foi criado e salvo.` :
          `Your report on ${topic} in ${location} for ${year} has been created and saved.`,
        duration: 3000
      });
    } catch (error) {
      console.error("Error generating or saving report:", error);
      toast({
        title: language === 'pt' ? "Erro" : "Error",
        description: language === 'pt' ? 
          "Ocorreu um erro ao gerar ou salvar o relatório." :
          "An error occurred while generating or saving the report.",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Report generation templates - Renewable Energy
  const generateEnergyReport = (topic: string, location: string, year: string, style: string) => {
    const reportStructures = [
      `# ${topic} in ${location} (${year})

## Executive Summary
This report examines the current state and future prospects of ${topic} in ${location} as of ${year}. The analysis shows significant growth in renewable energy investments, with increasing capacity and policy support contributing to a transformation of the energy landscape.

## Market Overview
The ${location} renewable energy market reached a capacity of 15.7 GW in ${year}, representing a 18.3% increase from the previous year. Insert Visualization 1 (Bar Chart: Installed Capacity by Technology Type)

## Policy Framework
Government support has been crucial to the sector's growth, with policy initiatives including feed-in tariffs, renewable portfolio standards, and tax incentives. These measures have created a favorable environment for investment and development.

## Investment Trends
Capital flows into renewable energy in ${location} totaled €4.2 billion in ${year}, with significant portions directed to solar and wind projects. Insert Visualization 2 (Pie Chart: Investment Distribution by Energy Source)

## Regional Development
The deployment of renewable energy infrastructure has varied significantly across regions, with some areas showing more rapid adoption than others. Insert Visualization 3 (Area Chart: Regional Renewable Energy Growth Rates)

## Challenges and Opportunities
Despite progress, challenges remain in grid integration, energy storage, and regulatory consistency. Opportunities exist in emerging technologies such as green hydrogen and advanced storage solutions.

## Conclusion
The analysis of ${topic} in ${location} during ${year} reveals a sector experiencing robust growth with strong future potential, though requiring continued policy support and technological innovation to overcome existing challenges.`,

      `# ${topic} in ${location}: A ${year} Assessment

## Introduction
This report provides a comprehensive assessment of ${topic} in ${location} during ${year}, examining key trends, challenges, and future directions in the transition to cleaner energy.

## Current Status
As of ${year}, renewable energy accounts for approximately 34% of ${location}'s total energy mix, up from 29% in the previous year. Insert Visualization 1 (Radar Chart: Renewable Energy Performance Metrics)

## Technology Trends
Solar photovoltaic and wind power have been the fastest-growing renewable technologies, with installations increasing by 27% and 23% respectively. Insert Visualization 2 (Line Graph: Technology Growth Trajectories)

## Economic Impact
The renewable energy sector directly employs over 85,000 people in ${location}, generating an estimated €7.8 billion in economic activity. Insert Visualization 3 (Bar Chart: Economic Indicators by Technology)

## Emissions Reduction
The expansion of renewable energy has contributed to a reduction of approximately 12.3 million tonnes of CO2 equivalent in ${year}. Insert Visualization 4 (Area Chart: Emissions Reduction Trend)

## Financing and Investment
Private investment has played an increasingly important role, with venture capital and private equity contributing 28% of total funding in ${year}. Insert Visualization 5 (Scatter Plot: Investment Returns vs. Project Scale)

## Policy Recommendations
Based on the analysis, we recommend strengthening grid integration policies, enhancing storage incentives, and developing more robust regional cooperation frameworks.

## Outlook
The future of ${topic} in ${location} appears promising, with projections suggesting renewable sources could account for over 50% of the energy mix by 2030, given sustained investment and supportive policies.`
    ];
    
    // Choose a report structure based on style or randomly
    const reportIndex = style === "analytical" ? 1 : 0;
    return reportStructures[reportIndex];
  };

  const generateEnergyReportPT = (topic: string, location: string, year: string, style: string) => {
    const reportStructures = [
      `# ${topic} em ${location} (${year})

## Resumo Executivo
Este relatório examina o estado atual e as perspectivas futuras de ${topic} em ${location} em ${year}. A análise mostra um crescimento significativo nos investimentos em energia renovável, com aumento de capacidade e apoio político contribuindo para uma transformação do panorama energético.

## Visão Geral do Mercado
O mercado de energia renovável de ${location} atingiu uma capacidade de 15,7 GW em ${year}, representando um aumento de 18,3% em relação ao ano anterior. Inserir Visualização 1 (Gráfico de Barras: Capacidade Instalada por Tipo de Tecnologia)

## Estrutura Política
O apoio governamental tem sido crucial para o crescimento do setor, com iniciativas políticas incluindo tarifas feed-in, padrões de portfólio renovável e incentivos fiscais. Estas medidas criaram um ambiente favorável para investimento e desenvolvimento.

## Tendências de Investimento
Os fluxos de capital para energia renovável em ${location} totalizaram €4,2 bilhões em ${year}, com partes significativas direcionadas a projetos solares e eólicos. Inserir Visualização 2 (Gráfico de Pizza: Distribuição de Investimentos por Fonte de Energia)

## Desenvolvimento Regional
A implantação de infraestrutura de energia renovável variou significativamente entre regiões, com algumas áreas mostrando adoção mais rápida que outras. Inserir Visualização 3 (Gráfico de Área: Taxas de Crescimento Regional de Energia Renovável)

## Desafios e Oportunidades
Apesar do progresso, permanecem desafios na integração à rede, armazenamento de energia e consistência regulatória. Existem oportunidades em tecnologias emergentes como hidrogênio verde e soluções avançadas de armazenamento.

## Conclusão
A análise de ${topic} em ${location} durante ${year} revela um setor experimentando crescimento robusto com forte potencial futuro, embora requeira apoio político contínuo e inovação tecnológica para superar os desafios existentes.`,

      `# ${topic} em ${location}: Uma Avaliação de ${year}

## Introdução
Este relatório fornece uma avaliação abrangente de ${topic} em ${location} durante ${year}, examinando tendências-chave, desafios e direções futuras na transição para energia mais limpa.

## Status Atual
Em ${year}, a energia renovável representa aproximadamente 34% da matriz energética total de ${location}, aumentando de 29% no ano anterior. Inserir Visualização 1 (Gráfico Radar: Métricas de Desempenho de Energia Renovável)

## Tendências Tecnológicas
A energia fotovoltaica solar e eólica têm sido as tecnologias renováveis de crescimento mais rápido, com instalações aumentando em 27% e 23%, respectivamente. Inserir Visualização 2 (Gráfico de Linha: Trajetórias de Crescimento Tecnológico)

## Impacto Econômico
O setor de energia renovável emprega diretamente mais de 85.000 pessoas em ${location}, gerando uma atividade econômica estimada em €7,8 bilhões. Inserir Visualização 3 (Gráfico de Barras: Indicadores Econômicos por Tecnologia)

## Redução de Emissões
A expansão da energia renovável contribuiu para uma redução de aproximadamente 12,3 milhões de toneladas de CO2 equivalente em ${year}. Inserir Visualização 4 (Gráfico de Área: Tendência de Redução de Emissões)

## Financiamento e Investimento
O investimento privado tem desempenhado um papel cada vez mais importante, com capital de risco e private equity contribuindo com 28% do financiamento total em ${year}. Inserir Visualização 5 (Gráfico de Dispersão: Retornos de Investimento vs. Escala de Projetos)

## Recomendações Políticas
Com base na análise, recomendamos fortalecer políticas de integração à rede, melhorar incentivos de armazenamento e desenvolver estruturas mais robustas de cooperação regional.

## Perspectivas
O futuro de ${topic} em ${location} parece promissor, com projeções sugerindo que fontes renováveis poderiam representar mais de 50% da matriz energética até 2030, dado investimento sustentado e políticas de apoio.`
    ];
    
    // Choose a report structure based on style or randomly
    const reportIndex = style === "analytical" ? 1 : 0;
    return reportStructures[reportIndex];
  };

  // Innovation report templates
  const generateInnovationReport = (topic: string, location: string, year: string, style: string) => {
    const reportStructures = [
      `# ${topic} in ${location}: ${year} Overview

## Executive Summary
This report examines the innovation ecosystem in ${location} during ${year}, with a focus on key developments, trends, and comparative analysis with previous years.

## Innovation Performance Metrics
${location}'s innovation index reached 68.4 in ${year}, representing a 3.2 point increase from the previous year. The country now ranks 15th globally in innovation performance. Insert Visualization 1 (Line Chart: Innovation Index Trend)

## R&D Investment Landscape
Total R&D expenditure in ${location} reached 1.9% of GDP in ${year}, with business enterprise R&D accounting for 56% of the total. Insert Visualization 2 (Pie Chart: R&D Expenditure by Sector)

## Patent Activity Analysis
Patent applications in ${location} increased by 12.3% in ${year}, with particularly strong growth in digital technologies and life sciences. Insert Visualization 3 (Bar Chart: Patent Applications by Field)

## Innovation Ecosystem Development
The startup ecosystem continued to mature in ${year}, with 342 new innovative companies founded and venture capital investment reaching €427 million. Insert Visualization 4 (Area Chart: Startup Funding Over Time)

## Regional Innovation Distribution
Innovation activity remains concentrated in major urban centers, though several emerging innovation hubs are showing promising growth. Insert Visualization 5 (Radar Chart: Regional Innovation Indicators)

## Policy Initiatives and Impact
Government support for innovation has expanded through new tax incentives, grant programs, and regulatory reforms. Impact assessment shows positive early results from these initiatives.

## International Collaboration
Cross-border innovation partnerships increased by 18% in ${year}, with particularly strong connections to European and North American research institutions. Insert Visualization 6 (Scatter Plot: International Collaboration Impact)

## Challenges and Recommendations
Despite progress, challenges remain in talent retention, scale-up financing, and technology transfer. We recommend targeted initiatives to address these specific areas.

## Conclusion
${location}'s innovation ecosystem shows positive momentum in ${year}, though continued policy support and private sector engagement will be crucial for sustaining this trajectory.`,

      `# ${topic} in ${location}: Comprehensive Analysis ${year}

## Introduction
This analysis provides an in-depth examination of the innovation landscape in ${location} during ${year}, assessing performance, identifying trends, and offering strategic insights.

## Innovation Performance Framework
Using a multidimensional framework, we assess ${location}'s innovation capabilities across research excellence, business innovation, infrastructure quality, and human capital development. Insert Visualization 1 (Radar Chart: Innovation Performance Dimensions)

## Sectoral Innovation Analysis
Innovation intensity varies significantly across sectors, with information technology, biotechnology, and clean energy demonstrating the highest innovation metrics. Insert Visualization 2 (Bar Chart: Innovation Intensity by Sector)

## Innovation Funding Flows
Capital allocation to innovation activities reached €3.8 billion in ${year}, with significant year-over-year growth in both public and private funding. Insert Visualization 3 (Area Chart: Funding Sources Evolution)

## Human Capital and Skills
The talent landscape shows strengths in technical skills but persistent gaps in entrepreneurial and managerial capabilities for innovation-led growth. Insert Visualization 4 (Scatter Plot: Skills Distribution vs. Demand)

## Technology Transfer Mechanisms
University-industry collaboration metrics improved by 16% in ${year}, though commercialization rates of public research remain below optimal levels. Insert Visualization 5 (Line Chart: Technology Transfer Indicators)

## Innovation Policy Evaluation
An assessment of policy effectiveness reveals strong performance in R&D incentives but weaknesses in regulatory frameworks for emerging technologies. Insert Visualization 6 (Bar Chart: Policy Effectiveness Ratings)

## Global Positioning Analysis
In global innovation rankings, ${location} shows competitive advantages in specific niches but faces challenges in scaling innovations for international markets. Insert Visualization 7 (Pie Chart: Global Market Share by Innovation Category)

## Future Outlook and Strategic Priorities
Based on current trajectories and global trends, we project continued improvement in ${location}'s innovation performance, contingent on addressing identified structural challenges.

## Recommendations
Strategic priorities should include strengthening the venture capital ecosystem, enhancing digital skills development, and streamlining regulatory approaches to emerging technologies.`
    ];
    
    // Choose a report structure based on style
    const reportIndex = style === "descriptive" ? 0 : 1;
    return reportStructures[reportIndex];
  };

  const generateInnovationReportPT = (topic: string, location: string, year: string, style: string) => {
    const reportStructures = [
      `# ${topic} em ${location}: Panorama ${year}

## Resumo Executivo
Este relatório examina o ecossistema de inovação em ${location} durante ${year}, com foco em desenvolvimentos-chave, tendências e análise comparativa com anos anteriores.

## Métricas de Desempenho em Inovação
O índice de inovação de ${location} atingiu 68,4 em ${year}, representando um aumento de 3,2 pontos em relação ao ano anterior. O país agora ocupa a 15ª posição global em desempenho de inovação. Inserir Visualização 1 (Gráfico de Linha: Tendência do Índice de Inovação)

## Panorama de Investimento em P&D
O gasto total em P&D em ${location} atingiu 1,9% do PIB em ${year}, com P&D empresarial representando 56% do total. Inserir Visualização 2 (Gráfico de Pizza: Gastos em P&D por Setor)

## Análise de Atividade de Patentes
As solicitações de patentes em ${location} aumentaram 12,3% em ${year}, com crescimento particularmente forte em tecnologias digitais e ciências da vida. Inserir Visualização 3 (Gráfico de Barras: Solicitações de Patentes por Campo)

## Desenvolvimento do Ecossistema de Inovação
O ecossistema de startups continuou a amadurecer em ${year}, com 342 novas empresas inovadoras fundadas e investimento de capital de risco atingindo €427 milhões. Inserir Visualização 4 (Gráfico de Área: Financiamento de Startups ao Longo do Tempo)

## Distribuição Regional da Inovação
A atividade de inovação permanece concentrada em grandes centros urbanos, embora vários polos emergentes de inovação estejam mostrando crescimento promissor. Inserir Visualização 5 (Gráfico Radar: Indicadores Regionais de Inovação)

## Iniciativas Políticas e Impacto
O apoio governamental à inovação expandiu-se através de novos incentivos fiscais, programas de subsídios e reformas regulatórias. A avaliação de impacto mostra resultados iniciais positivos dessas iniciativas.

## Colaboração Internacional
Parcerias de inovação transfronteiriças aumentaram 18% em ${year}, com conexões particularmente fortes com instituições de pesquisa europeias e norte-americanas. Inserir Visualização 6 (Gráfico de Dispersão: Impacto da Colaboração Internacional)

## Desafios e Recomendações
Apesar do progresso, permanecem desafios na retenção de talentos, financiamento de scale-up e transferência de tecnologia. Recomendamos iniciativas direcionadas para abordar essas áreas específicas.

## Conclusão
O ecossistema de inovação de ${location} mostra um impulso positivo em ${year}, embora o apoio político contínuo e o engajamento do setor privado sejam cruciais para sustentar essa trajetória.`,

      `# ${topic} em ${location}: Análise Abrangente ${year}

## Introdução
Esta análise fornece um exame aprofundado do panorama de inovação em ${location} durante ${year}, avaliando o desempenho, identificando tendências e oferecendo insights estratégicos.

## Estrutura de Desempenho em Inovação
Usando uma estrutura multidimensional, avaliamos as capacidades de inovação de ${location} em excelência em pesquisa, inovação empresarial, qualidade de infraestrutura e desenvolvimento de capital humano. Inserir Visualização 1 (Gráfico Radar: Dimensões de Desempenho em Inovação)

## Análise Setorial de Inovação
A intensidade de inovação varia significativamente entre setores, com tecnologia da informação, biotecnologia e energia limpa demonstrando as métricas de inovação mais altas. Inserir Visualização 2 (Gráfico de Barras: Intensidade de Inovação por Setor)

## Fluxos de Financiamento à Inovação
A alocação de capital para atividades de inovação atingiu €3,8 bilhões em ${year}, com crescimento significativo ano a ano tanto em financiamento público quanto privado. Inserir Visualização 3 (Gráfico de Área: Evolução das Fontes de Financiamento)

## Capital Humano e Habilidades
O panorama de talentos mostra pontos fortes em habilidades técnicas, mas lacunas persistentes em capacidades empreendedoras e gerenciais para o crescimento liderado pela inovação. Inserir Visualização 4 (Gráfico de Dispersão: Distribuição de Habilidades vs. Demanda)

## Mecanismos de Transferência de Tecnologia
As métricas de colaboração universidade-indústria melhoraram 16% em ${year}, embora as taxas de comercialização de pesquisa pública permaneçam abaixo dos níveis ideais. Inserir Visualização 5 (Gráfico de Linha: Indicadores de Transferência de Tecnologia)

## Avaliação de Política de Inovação
Uma avaliação da eficácia das políticas revela forte desempenho em incentivos à P&D, mas fraquezas em estruturas regulatórias para tecnologias emergentes. Inserir Visualização 6 (Gráfico de Barras: Classificações de Eficácia de Políticas)

## Análise de Posicionamento Global
Nos rankings globais de inovação, ${location} mostra vantagens competitivas em nichos específicos, mas enfrenta desafios na ampliação de inovações para mercados internacionais. Inserir Visualização 7 (Gráfico de Pizza: Participação no Mercado Global por Categoria de Inovação)

## Perspectivas Futuras e Prioridades Estratégicas
Com base nas trajetórias atuais e tendências globais, projetamos uma melhoria contínua no desempenho de inovação de ${location}, dependendo de abordar os desafios estruturais identificados.

## Recomendações
As prioridades estratégicas devem incluir o fortalecimento do ecossistema de capital de risco, o aprimoramento do desenvolvimento de habilidades digitais e a simplificação das abordagens regulatórias para tecnologias emergentes.`
    ];
    
    // Choose a report structure based on style
    const reportIndex = style === "descriptive" ? 0 : 1;
    return reportStructures[reportIndex];
  };

  // Technology report templates
  const generateTechnologyReport = (topic: string, location: string, year: string, style: string) => {
    const reportStructures = [
      `# ${topic} in ${location}: ${year} Assessment

## Executive Summary
This report analyzes the current state and evolution of ${topic} in ${location} during ${year}, highlighting key trends, developments, and future outlook.

## Digital Infrastructure Status
${location}'s digital infrastructure has experienced significant improvement, with fixed broadband coverage reaching 92% and average internet speeds increasing by 34% year-over-year. Insert Visualization 1 (Line Chart: Digital Infrastructure Growth)

## Technology Adoption Metrics
Business adoption of advanced digital technologies varies by sector and company size, with particularly strong uptake in financial services and manufacturing. Insert Visualization 2 (Bar Chart: Technology Adoption by Sector)

## Digital Skills Landscape
Digital literacy and advanced technical skills show an improving trend, though significant gaps remain, particularly in areas such as artificial intelligence and cybersecurity. Insert Visualization 3 (Radar Chart: Digital Skills Distribution)

## Technology Investment Analysis
Venture capital and private equity investment in technology startups reached €1.2 billion in ${year}, representing a 28% increase from the previous year. Insert Visualization 4 (Area Chart: Technology Investment Flows)

## Digital Transformation Case Studies
Several organizations have successfully implemented comprehensive digital transformation initiatives, yielding measurable improvements in operational efficiency and customer experience. Insert Visualization 5 (Scatter Plot: Digital Transformation Outcomes)

## Technology Policy Framework
Government initiatives have focused on accelerating digital adoption, improving connectivity, and addressing regulatory challenges related to emerging technologies. Insert Visualization 6 (Bar Chart: Policy Impact Assessment)

## International Benchmarking
In comparative analysis, ${location} ranks 18th globally in the Digital Economy Index, showing particular strengths in connectivity but weaknesses in advanced digital skills. Insert Visualization 7 (Radar Chart: International Comparison)

## Challenges and Opportunities
Key challenges include digital divide issues, cybersecurity concerns, and the need for regulatory modernization. Opportunities exist in emerging technologies such as artificial intelligence, blockchain, and quantum computing.

## Strategic Recommendations
Based on the analysis, we recommend prioritizing digital skills development, enhancing support for technology startups, and developing more agile regulatory frameworks for emerging technologies.`,

      `# The Evolving ${topic} Landscape in ${location}: ${year} Analysis

## Introduction
This comprehensive analysis examines the technological evolution in ${location} during ${year}, assessing digital maturity, identifying strategic trends, and providing actionable insights for stakeholders.

## Technology Sector Economic Contribution
The technology sector generated approximately €18.2 billion in economic value in ${year}, representing 8.7% of GDP and employing over 245,000 professionals. Insert Visualization 1 (Pie Chart: Technology Sector Economic Components)

## Digital Transformation Maturity Assessment
Using a multi-dimensional framework, we evaluate ${location}'s digital transformation maturity across industries, revealing significant variation in adoption and implementation capability. Insert Visualization 2 (Radar Chart: Digital Maturity by Industry)

## Emerging Technology Landscape
Analysis of patent applications, research publications, and commercial activity reveals artificial intelligence, Internet of Things, and advanced materials as the most dynamic areas of technological development. Insert Visualization 3 (Bar Chart: Emerging Technology Activity Metrics)

## Technology Startup Ecosystem
The startup ecosystem continued its growth trajectory, with 487 new technology startups founded and 38 achieving significant funding rounds in ${year}. Insert Visualization 4 (Scatter Plot: Startup Funding vs. Valuation)

## Digital Divide Analysis
Despite overall progress, significant disparities persist in technology access and utilization across geographic, demographic, and socioeconomic dimensions. Insert Visualization 5 (Area Chart: Digital Divide Indicators)

## Technology Skills Gap Assessment
Demand for technical skills exceeds supply by approximately 24%, with particularly acute shortages in data science, cybersecurity, and cloud computing. Insert Visualization 6 (Line Chart: Skills Demand vs. Supply)

## Technology Governance Evaluation
Regulatory frameworks for emerging technologies are evolving, though significant challenges remain in areas such as data governance, artificial intelligence ethics, and platform regulation. Insert Visualization 7 (Bar Chart: Regulatory Readiness by Technology Area)

## Strategic Technology Trends Forecast
Based on current trajectories and global patterns, we project accelerating adoption of artificial intelligence, distributed ledger technologies, and extended reality systems over the next 3-5 years.

## Actionable Recommendations
Key priorities should include developing specialized technology talent pipelines, enhancing digital infrastructure in underserved areas, and establishing more robust governance frameworks for emerging technologies.`
    ];
    
    // Choose a report structure based on style
    const reportIndex = style === "formal" ? 0 : 1;
    return reportStructures[reportIndex];
  };

  const generateTechnologyReportPT = (topic: string, location: string, year: string, style: string) => {
    const reportStructures = [
      `# ${topic} em ${location}: Avaliação ${year}

## Resumo Executivo
Este relatório analisa o estado atual e a evolução de ${topic} em ${location} durante ${year}, destacando tendências-chave, desenvolvimentos e perspectivas futuras.

## Status da Infraestrutura Digital
A infraestrutura digital de ${location} experimentou melhoria significativa, com cobertura de banda larga fixa atingindo 92% e velocidades médias de internet aumentando 34% ano a ano. Inserir Visualização 1 (Gráfico de Linha: Crescimento da Infraestrutura Digital)

## Métricas de Adoção de Tecnologia
A adoção empresarial de tecnologias digitais avançadas varia por setor e tamanho de empresa, com absorção particularmente forte em serviços financeiros e manufatura. Inserir Visualização 2 (Gráfico de Barras: Adoção de Tecnologia por Setor)

## Panorama de Habilidades Digitais
Alfabetização digital e habilidades técnicas avançadas mostram uma tendência de melhoria, embora permaneçam lacunas significativas, particularmente em áreas como inteligência artificial e cibersegurança. Inserir Visualização 3 (Gráfico Radar: Distribuição de Habilidades Digitais)

## Análise de Investimento em Tecnologia
O investimento de capital de risco e private equity em startups de tecnologia atingiu €1,2 bilhão em ${year}, representando um aumento de 28% em relação ao ano anterior. Inserir Visualização 4 (Gráfico de Área: Fluxos de Investimento em Tecnologia)

## Estudos de Caso de Transformação Digital
Várias organizações implementaram com sucesso iniciativas abrangentes de transformação digital, gerando melhorias mensuráveis na eficiência operacional e experiência do cliente. Inserir Visualização 5 (Gráfico de Dispersão: Resultados de Transformação Digital)

## Estrutura de Política Tecnológica
As iniciativas governamentais têm se concentrado em acelerar a adoção digital, melhorar a conectividade e abordar desafios regulatórios relacionados a tecnologias emergentes. Inserir Visualização 6 (Gráfico de Barras: Avaliação de Impacto de Políticas)

## Benchmarking Internacional
Em análise comparativa, ${location} ocupa a 18ª posição global no Índice de Economia Digital, mostrando pontos fortes particulares em conectividade, mas fraquezas em habilidades digitais avançadas. Inserir Visualização 7 (Gráfico Radar: Comparação Internacional)

## Desafios e Oportunidades
Os principais desafios incluem questões de exclusão digital, preocupações com cibersegurança e a necessidade de modernização regulatória. Existem oportunidades em tecnologias emergentes como inteligência artificial, blockchain e computação quântica.

## Recomendações Estratégicas
Com base na análise, recomendamos priorizar o desenvolvimento de habilidades digitais, aprimorar o suporte para startups de tecnologia e desenvolver estruturas regulatórias mais ágeis para tecnologias emergentes.`,

      `# O Panorama Evolutivo de ${topic} em ${location}: Análise ${year}

## Introdução
Esta análise abrangente examina a evolução tecnológica em ${location} durante ${year}, avaliando a maturidade digital, identificando tendências estratégicas e fornecendo insights acionáveis para stakeholders.

## Contribuição Econômica do Setor de Tecnologia
O setor de tecnologia gerou aproximadamente €18,2 bilhões em valor econômico em ${year}, representando 8,7% do PIB e empregando mais de 245.000 profissionais. Inserir Visualização 1 (Gráfico de Pizza: Componentes Econômicos do Setor de Tecnologia)

## Avaliação de Maturidade em Transformação Digital
Usando uma estrutura multidimensional, avaliamos a maturidade de transformação digital de ${location} entre indústrias, revelando variação significativa na capacidade de adoção e implementação. Inserir Visualização 2 (Gráfico Radar: Maturidade Digital por Indústria)

## Panorama de Tecnologias Emergentes
Análise de solicitações de patentes, publicações de pesquisa e atividade comercial revela inteligência artificial, Internet das Coisas e materiais avançados como as áreas mais dinâmicas de desenvolvimento tecnológico. Inserir Visualização 3 (Gráfico de Barras: Métricas de Atividade em Tecnologias Emergentes)

## Ecossistema de Startups de Tecnologia
O ecossistema de startups continuou sua trajetória de crescimento, com 487 novas startups de tecnologia fundadas e 38 alcançando rodadas significativas de financiamento em ${year}. Inserir Visualização 4 (Gráfico de Dispersão: Financiamento vs. Avaliação de Startups)

## Análise da Exclusão Digital
Apesar do progresso geral, persistem disparidades significativas no acesso e utilização de tecnologia entre dimensões geográficas, demográficas e socioeconômicas. Inserir Visualização 5 (Gráfico de Área: Indicadores de Exclusão Digital)

## Avaliação da Lacuna de Habilidades Tecnológicas
A demanda por habilidades técnicas excede a oferta em aproximadamente 24%, com escassez particularmente aguda em ciência de dados, cibersegurança e computação em nuvem. Inserir Visualização 6 (Gráfico de Linha: Demanda vs. Oferta de Habilidades)

## Avaliação de Governança Tecnológica
As estruturas regulatórias para tecnologias emergentes estão evoluindo, embora permaneçam desafios significativos em áreas como governança de dados, ética de inteligência artificial e regulação de plataformas. Inserir Visualização 7 (Gráfico de Barras: Prontidão Regulatória por Área Tecnológica)

## Previsão de Tendências Tecnológicas Estratégicas
Com base nas trajetórias atuais e padrões globais, projetamos aceleração na adoção de inteligência artificial, tecnologias de registro distribuído e sistemas de realidade estendida nos próximos 3-5 anos.

## Recomendações Acionáveis
As prioridades-chave devem incluir o desenvolvimento de pipelines de talentos tecnológicos especializados, aprimoramento da infraestrutura digital em áreas carentes e estabelecimento de estruturas de governança mais robustas para tecnologias emergentes.`
    ];
    
    // Choose a report structure based on style
    const reportIndex = style === "formal" ? 0 : 1;
    return reportStructures[reportIndex];
  };

  // Policy report templates  
  const generatePolicyReport = (topic: string, location: string, year: string, style: string) => {
    const reportStructures = [
      `# ${topic} in ${location}: ${year} Policy Analysis

## Executive Summary
This report examines the policy landscape related to ${topic} in ${location} during ${year}, evaluating implementation progress, effectiveness, and alignment with strategic objectives.

## Policy Framework Overview
The current policy framework consists of 14 major initiatives across regulatory reform, fiscal incentives, and strategic investment programs. Insert Visualization 1 (Bar Chart: Policy Implementation Status)

## Legislative Developments
Significant legislative changes were enacted in ${year}, including the Innovation Act, Digital Economy Framework, and Research Funding Reform. Insert Visualization 2 (Timeline: Legislative Milestones)

## Budget Allocation Analysis
Public expenditure on policy implementation reached €3.8 billion, representing a 12% increase from the previous year. Insert Visualization 3 (Pie Chart: Budget Allocation by Policy Area)

## Implementation Progress Assessment
Implementation rates vary significantly across policy domains, with particularly strong progress in digital infrastructure but delays in regulatory modernization. Insert Visualization 4 (Radar Chart: Implementation Metrics by Domain)

## Policy Impact Evaluation
Early impact assessment indicates positive outcomes in research activity, business formation, and technology adoption, though results remain preliminary. Insert Visualization 5 (Line Chart: Policy Impact Indicators)

## Stakeholder Response Analysis
Feedback from industry, academia, and civil society organizations shows generally positive reception, with specific concerns regarding implementation timelines and coordination. Insert Visualization 6 (Bar Chart: Stakeholder Satisfaction Ratings)

## International Comparative Analysis
In comparison to peer countries, ${location}'s policy approach shows distinctive emphasis on public-private partnerships and regional balance. Insert Visualization 7 (Scatter Plot: Policy Approach Comparison)

## Challenges and Implementation Barriers
Key challenges include administrative complexity, insufficient coordination across government departments, and skills gaps in implementation agencies.

## Recommendations for Policy Enhancement
Based on this analysis, we recommend streamlining administrative processes, strengthening monitoring mechanisms, and enhancing cross-departmental coordination structures.`,

      `# ${topic} Governance in ${location}: Comprehensive ${year} Review

## Introduction
This in-depth review provides a critical analysis of ${topic} governance in ${location} during ${year}, examining policy design, implementation effectiveness, and strategic alignment with national development objectives.

## Governance Architecture Assessment
The current institutional architecture for ${topic} involves 8 ministries, 12 agencies, and multiple coordination mechanisms of varying effectiveness. Insert Visualization 1 (Network Diagram: Institutional Architecture)

## Policy Coherence Analysis
Evaluation of policy coherence reveals both synergies and tensions across economic development, social inclusion, and sustainability objectives. Insert Visualization 2 (Heat Map: Policy Coherence Matrix)

## Regulatory Quality Evaluation
Assessment of regulatory instruments shows varying quality in terms of clarity, proportionality, and enforcement capacity. Insert Visualization 3 (Bar Chart: Regulatory Quality Indicators)

## Implementation Gap Analysis
Significant variations exist between policy intentions and implementation reality, with particular challenges in local capacity and resource allocation. Insert Visualization 4 (Area Chart: Implementation Gap Trends)

## Fiscal Instrument Effectiveness
Analysis of tax incentives, grants, and procurement policies reveals mixed effectiveness in achieving desired behavioral changes among target groups. Insert Visualization 5 (Radar Chart: Fiscal Instrument Performance)

## Evidence-Based Policy Assessment
Evaluation of the use of evidence in policy formulation shows improvement but continued challenges in data availability and analytical capacity. Insert Visualization 6 (Scatter Plot: Evidence Base vs. Policy Impact)

## Public Engagement Mechanisms
Stakeholder consultation and public participation processes have expanded but show limitations in inclusivity and influence on final policy decisions. Insert Visualization 7 (Line Chart: Public Engagement Metrics)

## Governance Innovation Examples
Several promising governance innovations have emerged, including regulatory sandboxes, policy labs, and new public-private partnership models. Insert Visualization 8 (Case Study Visualization)

## Strategic Recommendations
Priority areas for governance enhancement include institutional simplification, capability development in implementation agencies, and more robust evaluation mechanisms.`
    ];
    
    // Choose a report structure based on style
    const reportIndex = style === "analytical" ? 1 : 0;
    return reportStructures[reportIndex];
  };

  const generatePolicyReportPT = (topic: string, location: string, year: string, style: string) => {
    const reportStructures = [
      `# ${topic} em ${location}: Análise de Políticas ${year}

## Resumo Executivo
Este relatório examina o panorama político relacionado a ${topic} em ${location} durante ${year}, avaliando o progresso de implementação, eficácia e alinhamento com objetivos estratégicos.

## Visão Geral da Estrutura Política
A estrutura política atual consiste em 14 iniciativas principais abrangendo reforma regulatória, incentivos fiscais e programas de investimento estratégico. Inserir Visualização 1 (Gráfico de Barras: Status de Implementação de Políticas)

## Desenvolvimentos Legislativos
Mudanças legislativas significativas foram promulgadas em ${year}, incluindo a Lei de Inovação, Estrutura de Economia Digital e Reforma de Financiamento à Pesquisa. Inserir Visualização 2 (Linha do Tempo: Marcos Legislativos)

## Análise de Alocação Orçamentária
A despesa pública em implementação de políticas atingiu €3,8 bilhões, representando um aumento de 12% em relação ao ano anterior. Inserir Visualização 3 (Gráfico de Pizza: Alocação Orçamentária por Área Política)

## Avaliação de Progresso de Implementação
As taxas de implementação variam significativamente entre domínios políticos, com progresso particularmente forte em infraestrutura digital mas atrasos em modernização regulatória. Inserir Visualização 4 (Gráfico Radar: Métricas de Implementação por Domínio)

## Avaliação de Impacto de Políticas
A avaliação inicial de impacto indica resultados positivos em atividade de pesquisa, formação de empresas e adoção de tecnologia, embora os resultados permaneçam preliminares. Inserir Visualização 5 (Gráfico de Linha: Indicadores de Impacto de Políticas)

## Análise de Resposta dos Stakeholders
Feedback da indústria, academia e organizações da sociedade civil mostra recepção geralmente positiva, com preocupações específicas relacionadas a cronogramas de implementação e coordenação. Inserir Visualização 6 (Gráfico de Barras: Classificações de Satisfação dos Stakeholders)

## Análise Comparativa Internacional
Em comparação com países pares, a abordagem política de ${location} mostra ênfase distintiva em parcerias público-privadas e equilíbrio regional. Inserir Visualização 7 (Gráfico de Dispersão: Comparação de Abordagem Política)

## Desafios e Barreiras de Implementação
Os principais desafios incluem complexidade administrativa, coordenação insuficiente entre departamentos governamentais e lacunas de habilidades nas agências de implementação.

## Recomendações para Aprimoramento de Políticas
Com base nesta análise, recomendamos a simplificação de processos administrativos, fortalecimento de mecanismos de monitoramento e aprimoramento de estruturas de coordenação interdepartamental.`,

      `# Governança de ${topic} em ${location}: Revisão Abrangente ${year}

## Introdução
Esta revisão aprofundada fornece uma análise crítica da governança de ${topic} em ${location} durante ${year}, examinando o design de políticas, eficácia de implementação e alinhamento estratégico com objetivos nacionais de desenvolvimento.

## Avaliação da Arquitetura de Governança
A arquitetura institucional atual para ${topic} envolve 8 ministérios, 12 agências e múltiplos mecanismos de coordenação de eficácia variável. Inserir Visualização 1 (Diagrama de Rede: Arquitetura Institucional)

## Análise de Coerência Política
A avaliação de coerência política revela tanto sinergias quanto tensões entre objetivos de desenvolvimento econômico, inclusão social e sustentabilidade. Inserir Visualização 2 (Mapa de Calor: Matriz de Coerência Política)

## Avaliação de Qualidade Regulatória
A avaliação de instrumentos regulatórios mostra qualidade variável em termos de clareza, proporcionalidade e capacidade de enforcement. Inserir Visualização 3 (Gráfico de Barras: Indicadores de Qualidade Regulatória)

## Análise de Lacuna de Implementação
Existem variações significativas entre intenções políticas e realidade de implementação, com desafios particulares em capacidade local e alocação de recursos. Inserir Visualização 4 (Gráfico de Área: Tendências de Lacuna de Implementação)

## Eficácia de Instrumentos Fiscais
A análise de incentivos fiscais, subsídios e políticas de aquisição revela eficácia mista em alcançar mudanças comportamentais desejadas entre grupos-alvo. Inserir Visualização 5 (Gráfico Radar: Desempenho de Instrumentos Fiscais)

## Avaliação de Política Baseada em Evidências
A avaliação do uso de evidências na formulação de políticas mostra melhoria mas desafios contínuos na disponibilidade de dados e capacidade analítica. Inserir Visualização 6 (Gráfico de Dispersão: Base de Evidências vs. Impacto Político)

## Mecanismos de Engajamento Público
Os processos de consulta a stakeholders e participação pública expandiram, mas mostram limitações em inclusividade e influência nas decisões políticas finais. Inserir Visualização 7 (Gráfico de Linha: Métricas de Engajamento Público)

## Exemplos de Inovação em Governança
Várias inovações promissoras em governança emergiram, incluindo sandboxes regulatórias, laboratórios de política e novos modelos de parcerias público-privadas. Inserir Visualização 8 (Visualização de Estudo de Caso)

## Recomendações Estratégicas
Áreas prioritárias para aprimoramento de governança incluem simplificação institucional, desenvolvimento de capacidades em agências de implementação e mecanismos de avaliação mais robustos.`
    ];
    
    // Choose a report structure based on style
    const reportIndex = style === "analytical" ? 1 : 0;
    return reportStructures[reportIndex];
  };

  // Generic report templates
  const generateGenericReport = (topic: string, location: string, year: string, style: string) => {
    const reportStructures = [
      `# ${topic} in ${location}: ${year} Analysis

## Executive Summary
This report provides a comprehensive analysis of ${topic} in ${location} during ${year}, examining key trends, developments, challenges, and future prospects.

## Current Status Overview
${topic} has seen significant evolution in ${location} over the past year, with notable developments in regulatory frameworks, market dynamics, and stakeholder engagement. Insert Visualization 1 (Bar Chart: Key Performance Indicators)

## Historical Context and Trends
An examination of historical data reveals important trends that provide context for current developments and inform future projections. Insert Visualization 2 (Line Chart: Historical Trend Analysis)

## Key Stakeholder Analysis
Various stakeholders exert different levels of influence and interest in ${topic}, including government agencies, private sector organizations, civil society groups, and international partners. Insert Visualization 3 (Radar Chart: Stakeholder Influence and Interest)

## Regional Variation Assessment
Significant regional variations exist within ${location} regarding ${topic}, with different areas showing diverse patterns of development and implementation. Insert Visualization 4 (Area Chart: Regional Comparison Metrics)

## International Benchmarking
Compared to international standards and peer countries, ${location} shows distinctive characteristics in its approach to ${topic}, with both strengths and areas for improvement. Insert Visualization 5 (Scatter Plot: International Comparison)

## Case Studies
Several illustrative case studies demonstrate successful approaches and key challenges in implementing initiatives related to ${topic} across different contexts.

## Future Outlook
Based on current trajectories and identified factors, we project continued evolution of ${topic} in ${location}, with several potential scenarios depending on policy choices and external factors.

## Strategic Recommendations
This analysis leads to several strategic recommendations for policymakers, industry leaders, and other stakeholders to enhance outcomes related to ${topic} in ${location}.`,

      `# ${topic} in ${location}: Comprehensive ${year} Overview

## Introduction
This detailed overview examines the current state, evolution, and future directions of ${topic} in ${location} during ${year}, providing data-driven insights and strategic analysis.

## Methodology
This assessment employs a multi-method approach combining quantitative analysis of key indicators, qualitative stakeholder interviews, comparative benchmarking, and scenario planning techniques. Insert Visualization 1 (Methodology Framework Diagram)

## Performance Metrics Analysis
A comprehensive review of performance metrics reveals mixed results across different dimensions of ${topic}, with particular strengths in innovation but challenges in implementation. Insert Visualization 2 (Bar Chart: Performance Metrics Comparison)

## Structural Framework Assessment
The current structural framework supporting ${topic} in ${location} involves multiple institutions, regulatory mechanisms, and resource allocation systems of varying effectiveness. Insert Visualization 3 (Network Diagram: Structural Framework)

## Resource Allocation Patterns
Analysis of financial and human resource allocation shows significant variations across regions and program areas, with implications for outcomes and sustainability. Insert Visualization 4 (Pie Chart: Resource Allocation Distribution)

## Implementation Challenges
Several persistent challenges affect the implementation of initiatives related to ${topic}, including coordination issues, capacity constraints, and external factors. Insert Visualization 5 (Heat Map: Implementation Challenge Severity)

## Success Factors Identification
Examination of successful initiatives reveals several common factors contributing to positive outcomes, offering lessons for future programming. Insert Visualization 6 (Radar Chart: Success Factor Assessment)

## Strategic Scenarios
Based on identified trends and driving factors, we present three potential future scenarios for ${topic} in ${location}, with implications for different stakeholders. Insert Visualization 7 (Scenario Comparison Visualization)

## Actionable Recommendations
This analysis concludes with specific, actionable recommendations tailored to different stakeholder groups to enhance the effectiveness and impact of ${topic}-related initiatives in ${location}.`
    ];
    
    // Choose a report structure based on style
    const reportIndex = style === "descriptive" ? 0 : 1;
    return reportStructures[reportIndex];
  };

  const generateGenericReportPT = (topic: string, location: string, year: string, style: string) => {
    const reportStructures = [
      `# ${topic} em ${location}: Análise ${year}

## Resumo Executivo
Este relatório fornece uma análise abrangente de ${topic} em ${location} durante ${year}, examinando tendências-chave, desenvolvimentos, desafios e perspectivas futuras.

## Visão Geral do Status Atual
${topic} tem visto evolução significativa em ${location} ao longo do último ano, com desenvolvimentos notáveis em estruturas regulatórias, dinâmicas de mercado e engajamento de stakeholders. Inserir Visualização 1 (Gráfico de Barras: Indicadores-Chave de Desempenho)

## Contexto Histórico e Tendências
Um exame de dados históricos revela tendências importantes que fornecem contexto para desenvolvimentos atuais e informam projeções futuras. Inserir Visualização 2 (Gráfico de Linha: Análise de Tendência Histórica)

## Análise de Stakeholders-Chave
Vários stakeholders exercem diferentes níveis de influência e interesse em ${topic}, incluindo agências governamentais, organizações do setor privado, grupos da sociedade civil e parceiros internacionais. Inserir Visualização 3 (Gráfico Radar: Influência e Interesse dos Stakeholders)

## Avaliação de Variação Regional
Existem variações regionais significativas dentro de ${location} em relação a ${topic}, com diferentes áreas mostrando padrões diversos de desenvolvimento e implementação. Inserir Visualização 4 (Gráfico de Área: Métricas de Comparação Regional)

## Benchmarking Internacional
Comparado a padrões internacionais e países pares, ${location} mostra características distintivas em sua abordagem a ${topic}, com pontos fortes e áreas para melhoria. Inserir Visualização 5 (Gráfico de Dispersão: Comparação Internacional)

## Estudos de Caso
Vários estudos de caso ilustrativos demonstram abordagens bem-sucedidas e desafios-chave na implementação de iniciativas relacionadas a ${topic} em diferentes contextos.

## Perspectivas Futuras
Com base nas trajetórias atuais e fatores identificados, projetamos evolução contínua de ${topic} em ${location}, com vários cenários potenciais dependendo de escolhas políticas e fatores externos.

## Recomendações Estratégicas
Esta análise leva a várias recomendações estratégicas para formuladores de políticas, líderes da indústria e outros stakeholders para melhorar resultados relacionados a ${topic} em ${location}.`,

      `# ${topic} em ${location}: Visão Abrangente ${year}

## Introdução
Esta visão geral detalhada examina o estado atual, evolução e direções futuras de ${topic} em ${location} durante ${year}, fornecendo insights baseados em dados e análise estratégica.

## Metodologia
Esta avaliação emprega uma abordagem multi-método combinando análise quantitativa de indicadores-chave, entrevistas qualitativas com stakeholders, benchmarking comparativo e técnicas de planejamento de cenários. Inserir Visualização 1 (Diagrama de Estrutura Metodológica)

## Análise de Métricas de Desempenho
Uma revisão abrangente de métricas de desempenho revela resultados mistos em diferentes dimensões de ${topic}, com pontos fortes particulares em inovação mas desafios em implementação. Inserir Visualização 2 (Gráfico de Barras: Comparação de Métricas de Desempenho)

## Avaliação de Estrutura
A estrutura atual que suporta ${topic} em ${location} envolve múltiplas instituições, mecanismos regulatórios e sistemas de alocação de recursos de eficácia variável. Inserir Visualização 3 (Diagrama de Rede: Estrutura de Framework)

## Padrões de Alocação de Recursos
A análise de alocação de recursos financeiros e humanos mostra variações significativas entre regiões e áreas de programa, com implicações para resultados e sustentabilidade. Inserir Visualização 4 (Gráfico de Pizza: Distribuição de Alocação de Recursos)

## Desafios de Implementação
Vários desafios persistentes afetam a implementação de iniciativas relacionadas a ${topic}, incluindo questões de coordenação, restrições de capacidade e fatores externos. Inserir Visualização 5 (Mapa de Calor: Severidade de Desafios de Implementação)

## Identificação de Fatores de Sucesso
O exame de iniciativas bem-sucedidas revela vários fatores comuns que contribuem para resultados positivos, oferecendo lições para programação futura. Inserir Visualização 6 (Gráfico Radar: Avaliação de Fatores de Sucesso)

## Cenários Estratégicos
Com base em tendências identificadas e fatores motrizes, apresentamos três cenários futuros potenciais para ${topic} em ${location}, com implicações para diferentes stakeholders. Inserir Visualização 7 (Visualização de Comparação de Cenários)

## Recomendações Acionáveis
Esta análise conclui com recomendações específicas e acionáveis adaptadas a diferentes grupos de stakeholders para aumentar a eficácia e impacto de iniciativas relacionadas a ${topic} em ${location}.`
    ];
    
    // Choose a report structure based on style
    const reportIndex = style === "descriptive" ? 0 : 1;
    return reportStructures[reportIndex];
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{language === 'pt' ? "Gerador de Relatórios" : "Report Generator"}</CardTitle>
        <CardDescription>
          {language === 'pt' 
            ? "Gere relatórios detalhados baseados em tópico, local e ano" 
            : "Generate detailed reports based on topic, location, and year"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="topic">
              {language === 'pt' ? "Tópico" : "Topic"}
            </Label>
            <Input 
              id="topic" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)}
              placeholder={language === 'pt' ? "Ex: Inovação em energia renovável" : "E.g., Innovation in renewable energy"} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">
              {language === 'pt' ? "Localização" : "Location"}
            </Label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              placeholder={language === 'pt' ? "Ex: Portugal" : "E.g., Portugal"} 
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="year">
              {language === 'pt' ? "Ano" : "Year"}
            </Label>
            <Input 
              id="year" 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
              placeholder={new Date().getFullYear().toString()} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="style">
              {language === 'pt' ? "Estilo do Relatório" : "Report Style"}
            </Label>
            <Select value={reportStyle} onValueChange={setReportStyle}>
              <SelectTrigger id="style">
                <SelectValue placeholder={language === 'pt' ? "Selecione um estilo" : "Select a style"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">{language === 'pt' ? "Formal" : "Formal"}</SelectItem>
                <SelectItem value="analytical">{language === 'pt' ? "Analítico" : "Analytical"}</SelectItem>
                <SelectItem value="descriptive">{language === 'pt' ? "Descritivo" : "Descriptive"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button 
          onClick={generateReport} 
          disabled={isLoading || !topic || !location || !year}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {language === 'pt' ? "Gerando..." : "Generating..."}
            </>
          ) : (
            language === 'pt' ? "Gerar Relatório" : "Generate Report"
          )}
        </Button>
        
        {generatedReport && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'pt' ? "Relatório Gerado" : "Generated Report"}
            </h3>
            <div className="border rounded-md p-4 bg-gray-50 max-h-[500px] overflow-y-auto">
              {visualizations.map((viz, index) => (
                <ReportVisualizer key={index} visualization={viz} />
              ))}
              
              <div className="prose max-w-none mt-4">
                {generatedReport.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.replace('# ', '')}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-semibold mt-5 mb-3">{line.replace('## ', '')}</h2>;
                  } else if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{line.replace('### ', '')}</h3>;
                  } else if (line.includes('Insert Visualization') || line.includes('Inserir Visualização')) {
                    return (
                      <div key={index} className="bg-gray-100 p-4 my-4 rounded-md text-sm text-gray-700 italic">
                        {language === 'pt' 
                          ? "Visualização de dados aqui" 
                          : "Data visualization here"}
                      </div>
                    );
                  } else if (line === '') {
                    return <br key={index} />;
                  } else {
                    return <p key={index} className="my-3 text-gray-700">{line}</p>;
                  }
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
