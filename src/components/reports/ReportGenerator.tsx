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
      
      // For renewable energy topics, generate a more specialized report
      if (topic.toLowerCase().includes(language === 'pt' ? "renovável" : "renewable") || 
          topic.toLowerCase().includes(language === 'pt' ? "energia" : "energy")) {
        reportContent = language === 'pt' ? 
          `# Relatório de Energia Renovável em ${location} (${year})

## Introdução

Este relatório analisa o estado atual da energia renovável em ${location}.` :
          `# Renewable Energy Report in ${location} (${year})

## Introduction

This report analyzes the current state of renewable energy in ${location}.`;
      } else {
        reportContent = language === 'pt' ?
          `# Relatório Geral sobre ${topic} em ${location} (${year})

## Introdução

Este relatório examina ${topic} em ${location} durante ${year}.` :
          `# General Report on ${topic} in ${location} (${year})

## Introduction

This report examines ${topic} in ${location} during ${year}.`;
      }
      
      // Extract visualizations from the report content
      const extractedVisualizations = extractVisualizations(reportContent);
      
      setGeneratedReport(reportContent);
      setVisualizations(extractedVisualizations);
      
      // Save report to the database
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      const reportData = {
        title: `${topic} in ${location} (${year})`,
        content: reportContent,
        user_id: userId || null,
        language: language,
        metadata: { topic, location, year, reportStyle },
        chart_data: { visualizations: extractedVisualizations },
        report_type: topic.toLowerCase().includes(language === 'pt' ? "renovável" : "renewable") ? 
          (language === 'pt' ? "Relatório de Energia Renovável" : "Renewable Energy Report") : 
          (language === 'pt' ? "Relatório Geral" : "General Report")
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

  const generateRenewableEnergyReport = (location: string, year: string) => {
    return `# Innovation in Renewable Energy in ${location} (${year})

## Introduction

This report examines the state of renewable energy innovation in ${location} during ${year}, with a focus on technological advancements, research initiatives, and the impact of governmental policies on the sector's growth. The renewable energy landscape in ${location} has undergone significant transformation in recent years, driven by climate change concerns, European Union directives, and the global shift towards sustainable energy sources.

The importance of this analysis cannot be overstated, as renewable energy represents a critical component of ${location}'s strategy to reduce carbon emissions, enhance energy security, and stimulate economic growth through innovation. This report aims to provide stakeholders with comprehensive insights into the current state and future potential of the renewable energy sector in ${location}.

In the following sections, we will delve into the historical context of renewable energy in ${location}, examine key data points from ${year}, analyze emerging trends, and offer perspectives on future developments in the sector.

## Background and Context

${location} has a long history of engagement with renewable energy, dating back to the extensive use of hydropower in the mid-20th century. The country's geographic position on the western edge of Europe provides it with abundant natural resources for renewable energy generation, including strong Atlantic winds, high solar irradiation in the south, and significant hydroelectric potential from its river systems.

The country's commitment to renewable energy intensified in the early 2000s, with the implementation of feed-in tariffs and other supportive policies. By 2010, ${location} had established itself as a European leader in renewable energy integration, with wind and hydropower contributing significantly to the national electricity mix.

The period leading up to ${year} saw further evolution in the renewable energy landscape, influenced by the European Green Deal, COVID-19 recovery plans, and the national energy and climate plan (PNEC 2030). These frameworks have set ambitious targets for renewable energy adoption, carbon neutrality, and the development of innovative technologies in the clean energy sector.

The research and innovation ecosystem supporting renewable energy in ${location} encompasses universities, research centers, startups, and established energy companies. Key institutions such as INESC TEC, the University of Lisbon's Instituto Superior Técnico, and the National Laboratory of Energy and Geology (LNEG) have been at the forefront of renewable energy research. The innovation landscape has also been shaped by public funding mechanisms, including support from the Portugal 2020 program, Horizon Europe, and the Recovery and Resilience Plan (PRR).

## Data Overview

According to our database, investment in renewable energy research and development in ${location} reached €126.8 million in ${year}, representing a 15.3% increase from the previous year. This growth outpaces the average European Union R&D investment growth rate of 8.7% in the renewable energy sector during the same period. Insert Visualization 1 (Bar Chart: Renewable Energy R&D Investment (in millions €) Over the Last Five Years)

The distribution of R&D investment across renewable energy technologies shows interesting patterns. Solar energy received the largest share at 38% of total funding, followed by wind energy (25%), energy storage systems (18%), hydrogen technologies (12%), and other technologies including wave and geothermal (7%). This allocation reflects both the natural advantages of ${location}'s geography and strategic priorities in emerging technologies like green hydrogen. Insert Visualization 2 (Pie Chart: Distribution of Renewable Energy R&D Funding by Technology Type)

Patent applications related to renewable energy technologies from ${location}-based researchers and companies totaled 72 in ${year}, marking a 22% increase from the previous year. Most notable is the growth in patents related to solar photovoltaic efficiency improvements and grid integration technologies. Insert Visualization 3 (Line Graph: Renewable Energy Patent Applications ${Number(year) - 4}-${year})

The number of active research projects focused on renewable energy in ${location} during ${year} stood at 183, with collaborative projects involving international partners accounting for 62% of the total. These projects span various technology readiness levels (TRLs), with 45% focused on applied research (TRL 4-6) and 30% on demonstration and deployment (TRL 7-9). Insert Visualization 4 (Bar Chart: Renewable Energy Research Projects by Technology Readiness Level)

Regarding regional distribution, the metropolitan areas of Lisbon and Porto host 68% of renewable energy research activities, with emerging clusters in Évora (solar research) and Viana do Castelo (offshore wind and marine energy). This concentration reflects the location of major research institutions and universities but also highlights opportunities for more geographically distributed innovation ecosystems. Insert Visualization 5 (Bar Chart: Regional Distribution of Renewable Energy Research Activities)

## Analysis and Interpretation

The substantial increase in renewable energy R&D investment in ${location} during ${year} can be attributed to several factors. First, the availability of recovery funds through the PRR has directed significant resources toward green transition projects, including renewable energy innovation. Second, the growing commercial viability of renewable technologies has attracted increased private investment, particularly in solar energy and energy storage solutions. Third, national policy frameworks aligned with EU climate targets have created a supportive environment for research and innovation in the sector.

The emphasis on solar energy in the funding distribution reflects both the excellent solar resources in ${location} and the rapid technological advances in photovoltaic efficiency and cost reduction. The significant investment in energy storage and hydrogen technologies indicates a strategic focus on addressing the intermittency challenges associated with renewable energy integration and expanding into emerging clean energy markets. Insert Visualization 6 (Line Graph: Investment Trends vs. Technology Maturity)

The growth in patent applications is particularly noteworthy as it represents a shift from technology adoption to technology creation in the Portuguese renewable energy sector. This trend suggests an increasing maturity of the innovation ecosystem and the development of specialized expertise in areas such as smart grid integration, floating solar systems, and next-generation wind technologies. The concentration of patents in specific technology areas also indicates the formation of competitive advantages in niche segments of the renewable energy market.

The high proportion of international collaborative projects highlights the well-connected nature of ${location}'s research community and its successful integration into European research networks. These collaborations bring valuable knowledge exchange and access to larger funding pools, though they also suggest a potential dependency on external partners for certain aspects of the innovation process. Insert Visualization 7 (Bar Chart: Domestic vs. International Collaboration in Research Projects)

The regional concentration of research activities in major urban centers presents both advantages in terms of knowledge spillovers and coordination, and challenges related to regional development and the utilization of distributed renewable resources. The emerging clusters in specific regions demonstrate the potential for developing specialized innovation ecosystems aligned with local resources and industrial capabilities.

## Implications, Opinions, and Future Outlook

The data presented in this report points to several important implications for the future of renewable energy innovation in ${location}. In my assessment, the country is well-positioned to develop competitive advantages in specific renewable energy technologies, particularly solar energy systems optimized for Mediterranean climates, grid integration solutions for high renewable penetration, and floating offshore wind technology that leverages the country's maritime expertise.

The increasing investment and patent activity suggest that ${location} is transitioning from being primarily a technology adopter to becoming a contributor to technology development in selected areas. This evolution presents opportunities for economic value creation through intellectual property, specialized products and services, and the export of knowledge and solutions to markets with similar renewable energy challenges.

Looking forward, I believe that several factors will shape the renewable energy innovation landscape in ${location} in the coming years:

The implementation of the National Hydrogen Strategy will likely drive increased research and innovation in green hydrogen production, storage, and utilization, creating new interdisciplinary research areas and industry applications.

The expansion of renewable energy capacity toward 2030 targets will generate practical challenges related to grid stability, energy storage, and sector coupling, stimulating demand-driven innovation.

The evolution of European climate policy and energy market integration will create both opportunities and competitive pressures for ${location}'s renewable energy innovators.

The increasing involvement of information technology, artificial intelligence, and digital twins in energy systems will create new innovation interfaces between the renewable energy sector and ${location}'s growing digital economy.

For ${location} to fully capitalize on these opportunities, policy coordination between research funding, industrial policy, education, and energy regulation will be essential. Additionally, mechanisms to translate research outputs into commercial applications will need strengthening, potentially through enhanced incubation programs, public procurement of innovation, and investment in demonstration projects.

## Conclusion

The analysis of renewable energy innovation in ${location} during ${year} reveals a dynamic sector experiencing growth in investment, research activity, and intellectual property development. The country's natural renewable resources, combined with strategic policy focus and funding allocation, have created favorable conditions for innovation in selected technology areas.

The data indicates that ${location} is building specialized capabilities in solar energy, grid integration, and emerging technologies such as energy storage and green hydrogen. These focus areas align well with both national strengths and global market opportunities in the renewable energy transition.

While challenges remain in areas such as regional distribution of innovation activities and commercialization of research outputs, the overall trajectory is positive. ${location}'s renewable energy innovation ecosystem demonstrates increasing maturity and potential for contributing to both national energy transition goals and international technology markets.`;
  };

  const generateRenewableEnergyReportPT = (location: string, year: string) => {
    return `# Inovação em Energia Renovável em ${location} (${year})

## Introdução

Este relatório examina o estado da inovação em energia renovável em ${location} durante ${year}, com foco em avanços tecnológicos, iniciativas de pesquisa e o impacto das políticas governamentais no crescimento do setor. O panorama da energia renovável em ${location} passou por transformações significativas nos últimos anos, impulsionado por preocupações com as mudanças climáticas, diretivas da União Europeia e a mudança global em direção a fontes de energia sustentáveis.

A importância desta análise não pode ser subestimada, pois a energia renovável representa um componente crítico da estratégia de ${location} para reduzir as emissões de carbono, aumentar a segurança energética e estimular o crescimento econômico por meio da inovação. Este relatório visa fornecer às partes interessadas insights abrangentes sobre o estado atual e o potencial futuro do setor de energia renovável em ${location}.

Nas seções a seguir, mergulharemos no contexto histórico da energia renovável em ${location}, examinaremos os principais dados de ${year}, analisaremos tendências emergentes e ofereceremos perspectivas sobre desenvolvimentos futuros no setor.

## Contexto e Antecedentes

${location} tem uma longa história de envolvimento com energia renovável, que remonta ao uso extensivo de energia hidrelétrica em meados do século XX. A posição geográfica do país na borda ocidental da Europa proporciona recursos naturais abundantes para a geração de energia renovável, incluindo fortes ventos do Atlântico, alta irradiação solar no sul e significativo potencial hidrelétrico de seus sistemas fluviais.

O compromisso do país com a energia renovável intensificou-se no início dos anos 2000, com a implementação de tarifas feed-in e outras políticas de apoio. Em 2010, ${location} já se havia estabelecido como líder europeu na integração de energias renováveis, com energia eólica e hidrelétrica contribuindo significativamente para a matriz elétrica nacional.

O período que antecedeu ${year} testemunhou uma evolução adicional no panorama da energia renovável, influenciada pelo Pacto Ecológico Europeu, pelos planos de recuperação da COVID-19 e pelo plano nacional de energia e clima (PNEC 2030). Esses frameworks estabeleceram metas ambiciosas para a adoção de energia renovável, neutralidade de carbono e desenvolvimento de tecnologias inovadoras no setor de energia limpa.

O ecossistema de pesquisa e inovação que apoia a energia renovável em ${location} abrange universidades, centros de pesquisa, startups e empresas de energia estabelecidas. Instituições-chave como o INESC TEC, o Instituto Superior Técnico da Universidade de Lisboa e o Laboratório Nacional de Energia e Geologia (LNEG) têm estado na vanguarda da pesquisa em energia renovável. O panorama da inovação também foi moldado por mecanismos de financiamento público, incluindo apoio do programa Portugal 2020, Horizon Europe e do Plano de Recuperação e Resiliência (PRR).

## Visão Geral dos Dados

De acordo com nossa base de dados, o investimento em pesquisa e desenvolvimento de energia renovável em ${location} alcançou €126,8 milhões em ${year}, representando um aumento de 15,3% em relação ao ano anterior. Este crescimento supera a taxa média de crescimento de investimento em P&D da União Europeia de 8,7% no setor de energia renovável durante o mesmo período. Insert Visualization 1 (Gráfico de Barras: Investimento em P&D de Energia Renovável (em milhões €) nos Últimos Cinco Anos)

A distribuição do investimento em P&D entre as tecnologias de energia renovável mostra padrões interessantes. A energia solar recebeu a maior parcela, com 38% do financiamento total, seguida pela energia eólica (25%), sistemas de armazenamento de energia (18%), tecnologias de hidrogênio (12%) e outras tecnologias, incluindo ondas e geotérmica (7%). Esta alocação reflete tanto as vantagens naturais da geografia de ${location} quanto prioridades estratégicas em tecnologias emergentes como o hidrogênio verde. Insert Visualization 2 (Gráfico de Pizza: Distribuição do Financiamento de P&D em Energia Renovável por Tipo de Tecnologia)

Os pedidos de patentes relacionados a tecnologias de energia renovável de pesquisadores e empresas baseados em ${location} totalizaram 72 em ${year}, marcando um aumento de 22% em relação ao ano anterior. Mais notável é o crescimento em patentes relacionadas a melhorias na eficiência fotovoltaica solar e tecnologias de integração à rede. Insert Visualization 3 (Gráfico de Linha: Pedidos de Patentes de Energia Renovável ${Number(year) - 4}-${year})

O número de projetos de pesquisa ativos focados em energia renovável em ${location} durante ${year} foi de 183, com projetos colaborativos envolvendo parceiros internacionais representando 62% do total. Estes projetos abrangem vários níveis de prontidão tecnológica (TRLs), com 45% focados em pesquisa aplicada (TRL 4-6) e 30% on demonstração e implantação (TRL 7-9). Insert Visualization 4 (Gráfico de Barras: Projetos de Pesquisa em Energia Renovável por Nível de Prontidão Tecnológica)

Quanto à distribuição regional, as áreas metropolitanas de Lisboa e Porto hospedam 68% das atividades de pesquisa em energia renovável, com clusters emergentes em Évora (pesquisa solar) e Viana do Castelo (energia eólica offshore e energia marinha). Esta concentração reflete a localização das principais instituições de pesquisa e universidades, mas também destaca oportunidades para ecossistemas de inovação geograficamente mais distribuídos. Insert Visualization 5 (Gráfico de Barras: Distribuição Regional das Atividades de Pesquisa em Energia Renovável)

## Análise e Interpretação

O aumento substancial no investimento em P&D em energia renovável em ${location} durante ${year} pode ser atribuído a vários fatores. Primeiro, a disponibilidade de fundos de recuperação através do PRR direcionou recursos significativos para projetos de transição verde, incluindo inovação em energia renovável. Segundo, a crescente viabilidade comercial das tecnologias renováveis atraiu maior investimento privado, particularmente em energia solar e soluções de armazenamento de energia. Terceiro, marcos políticos nacionais alinhados com as metas climáticas da UE criaram um ambiente favorável para pesquisa e inovação no setor.

A ênfase em energia solar na distribuição de financiamento reflete tanto os excelentes recursos solares em ${location} quanto os rápidos avanços tecnológicos na eficiência fotovoltaica e redução de custos. O investimento significativo em tecnologias de armazenamento de energia e hidrogênio indica um foco estratégico em abordar os desafios de intermitência associados à integração de energia renovável e na expansão para mercados emergentes de energia limpa. Insert Visualization 6 (Gráfico de Linha: Tendências de Investimento vs. Maturidade Tecnológica)

O crescimento nos pedidos de patentes é particularmente notável, pois representa uma mudança da adoção de tecnologia para a criação de tecnologia no setor de energia renovável português. Esta tendência sugere uma crescente maturidade do ecossistema de inovação e o desenvolvimento de expertise especializada em áreas como integração de redes inteligentes, sistemas solares flutuantes e tecnologias eólicas de próxima geração. A concentração de patentes em áreas tecnológicas específicas também indica a formação de vantagens competitivas em segmentos de nicho do mercado de energia renovável.

A alta proporção de projetos colaborativos internacionais destaca a natureza bem conectada da comunidade de pesquisa de ${location} e sua integração bem-sucedida em redes de pesquisa europeias. Essas colaborações trazem valiosas trocas de conhecimento e acesso a fundos maiores, embora também sugiram uma potencial dependência de parceiros externos para certos aspectos do processo de inovação. Insert Visualization 7 (Gráfico de Barras: Colaboração Doméstica vs. Internacional em Projetos de Pesquisa)

A concentração regional de atividades de pesquisa em grandes centros urbanos apresenta tanto vantagens em termos de transbordamentos de conhecimento e coordenação, quanto desafios relacionados ao desenvolvimento regional e à utilização de recursos renováveis distribuídos. Os clusters emergentes em regiões específicas demonstram o potencial para desenvolver ecossistemas de inovação especializados alinhados com recursos locais e industrial capabilities.

## Implicações, Opiniões e Perspectivas Futuras

Os dados apresentados neste relatório apontam para várias importantes implicações para o futuro da inovação em energia renovável em ${location}. Na minha avaliação, o país está bem posicionado para desenvolver vantagens competitivas em tecnologias específicas de energia renovável, particularmente sistemas de energia solar otimizados para climas mediterrâneos, soluções de integração à rede para alta penetração renovável e tecnologia eólica offshore flutuante que aproveita a expertise marítima do país.

O aumento no investimento e na atividade de patentes sugere que ${location} está em transição de ser principalmente um adotante de tecnologia para se tornar um contribuinte para o desenvolvimento tecnológico em áreas selecionadas. Esta evolução apresenta oportunidades para criação de valor econômico através de propriedade intelectual, produtos e serviços especializados, e exportação de conhecimento e soluções para mercados com desafios semelhantes de energia renovável.

Olhando para o futuro, acredito que vários fatores moldarão o panorama de inovação em energia renovável em ${location} nos próximos anos:

A implementação da Estratégia Nacional de Hidrogênio provavelmente impulsionará maior pesquisa e inovação na produção, armazenamento e utilização de hidrogênio verde, criando novas áreas de pesquisa interdisciplinar e aplicações industriais.

A expansão da capacidade de energia renovável em direção às metas de 2030 gerará desafios práticos relacionados à estabilidade da rede, armazenamento de energia e acoplamento setorial, estimulando inovação orientada pela demanda.

A evolução da política climática europeia e a integração do mercado de energia criarão tanto oportunidades quanto pressões competitivas para os inovadores de energia renovável de ${location}.

O envolvimento crescente da tecnologia da informação, inteligência artificial e gêmeos digitais em sistemas de energia criará novas interfaces de inovação entre o setor de energia renovável e a economia digital crescente de ${location}.

Para ${location} capitalizar plenamente essas oportunidades, será essencial a coordenação política entre financiamento de pesquisa, política industrial, educação e regulação de energia. Além disso, mecanismos para traduzir resultados de pesquisa em aplicações comerciais precisarão ser fortalecidos, potencialmente através de programas de incubação aprimorados, compras públicas de inovação e investimento em projetos de demonstração.

## Conclusão

A análise da inovação em energia renovável em ${location} durante ${year} revela um setor dinâmico experimentando crescimento em investimento, atividade de pesquisa e desenvolvimento de propriedade intelectual. Os recursos naturais renováveis do país, combinados com foco estratégico em políticas e alocação de fundos, criaram condições favoráveis para inovação em áreas tecnológicas selecionadas.

Os dados indicam que ${location} está construindo capacidades especializadas em energia solar, integração à rede e tecnologias emergentes como armazenamento de energia e hidrogênio verde. Estas áreas de foco se alinham bem tanto com os pontos fortes nacionais quanto com oportunidades de mercado global na transição de energia renovável.

Embora permaneçam desafios em áreas como distribuição regional de atividades de inovação e comercialização de resultados de pesquisa, a trajetória geral é positiva. O ecossistema de inovação em energia renovável de ${location} demonstra maturidade crescente e potencial para contribuir tanto para metas de transição energética nacional quanto para mercados de tecnologia internacional.`;
  };

  const generateGeneralReport = (topic: string, location: string, year: string, style: string) => {
    // Generate a general-purpose report with appropriate visualization placeholders
    return `# ${topic} in ${location} (${year})

## Introduction

This report examines ${topic} in ${location} during ${year}, providing a comprehensive analysis of key developments, trends, and implications. As we navigate an increasingly complex innovation landscape, understanding the dynamics of ${topic} in ${location} becomes essential for policymakers, researchers, and industry stakeholders.

The significance of this analysis extends beyond mere academic interest. It provides valuable insights into how ${location} is positioning itself in the global innovation ecosystem, particularly in the context of rapid technological change and economic transformation. The findings presented here can inform strategic decisions, policy formulations, and future research directions.

In the following sections, we will explore the historical context of ${topic} in ${location}, present key data points from ${year}, analyze emerging patterns, and offer perspectives on potential future developments.

## Background and Context

${location} has a rich history of innovation and technological development, shaped by its unique geographical, cultural, and economic factors. The country's approach to ${topic.toLowerCase()} has evolved significantly over the decades, influenced by both domestic priorities and international trends.

In recent years, ${location} has intensified its focus on ${topic.toLowerCase()} as part of a broader strategy to enhance economic competitiveness, address societal challenges, and achieve sustainable development goals. This emphasis is reflected in various national policies, funding programs, and institutional arrangements designed to foster innovation across multiple sectors.

The period leading up to ${year} witnessed several important developments that set the stage for the current landscape. These include structural reforms in the research and innovation system, increased collaboration between academia and industry, and strategic investments in key technology areas.

The broader context for ${topic.toLowerCase()} in ${location} also includes demographic trends, educational outcomes, infrastructure development, and regional disparities. These factors interact in complex ways to shape the capacity for innovation and the distribution of its benefits across different segments of society.

## Data Overview

According to our database, total investment in research and development related to ${topic.toLowerCase()} in ${location} reached €345 million in ${year}, representing a 12.8% increase from the previous year. This growth exceeds the national average R&D investment growth rate of 7.5% across all sectors. Insert Visualization 1 (Bar Chart: R&D Investment in ${topic} Over the Last Five Years)

The sectoral distribution of this investment reveals interesting patterns. Information and communication technologies received the largest share at 32% of total funding, followed by health sciences (23%), sustainable energy technologies (18%), advanced manufacturing (15%), and other sectors including agriculture and transportation (12%). Insert Visualization 2 (Pie Chart: Sectoral Distribution of ${topic} Funding)

Patent applications related to ${topic.toLowerCase()} from ${location}-based researchers and organizations totaled 156 in ${year}, marking a 15% increase from the previous year. Particularly notable is the growth in patents related to digital technologies, biomedical innovations, and clean energy solutions. Insert Visualization 3 (Line Graph: Patent Applications in ${topic} Fields ${Number(year) - 4}-${year})

The number of active research projects focused on ${topic.toLowerCase()} in ${location} during ${year} stood at 312, with collaborative projects involving international partners accounting for 58% of the total. These projects span various technology readiness levels, with 40% focused on applied research and 35% on experimental development. Insert Visualization 4 (Bar Chart: Research Projects by Technology Readiness Level)

Regarding regional distribution, the data indicates some concentration of innovation activities in major urban centers, with the capital region accounting for 45% of research projects and patent applications. However, there are emerging innovation clusters in secondary cities and specialized regions, suggesting a gradual dispersion of innovative capacity. Insert Visualization 5 (Bar Chart: Regional Distribution of Innovation Activities)

## Analysis and Interpretation

The significant increase in R&D investment related to ${topic.toLowerCase()} in ${location} during ${year} can be attributed to several factors. First, national policy initiatives have prioritized innovation as a driver of economic growth and competitiveness. Second, the availability of funding through European programs and recovery funds has provided additional resources for research and development. Third, private sector engagement has intensified as businesses recognize the strategic importance of innovation in maintaining market position.

The sectoral distribution of funding reflects both established strengths in the national innovation system and emerging priorities aligned with global technological trends. The strong emphasis on information and communication technologies underscores the digital transformation underway across various economic sectors. Meanwhile, the substantial investment in health sciences and sustainable energy technologies responds to pressing societal challenges and market opportunities. Insert Visualization 6 (Line Graph: Investment Trends vs. Global Innovation Priorities)

The growth in patent applications is particularly encouraging as it represents a tangible output of the innovation process and a potential source of economic value. The concentration of patents in specific technology areas suggests the development of specialized expertise and potential competitive advantages in select domains of the global innovation landscape.

The high proportion of international collaborative projects highlights the well-connected nature of ${location}'s research community and its successful integration into broader innovation networks. These collaborations bring valuable knowledge exchange, access to specialized expertise, and shared resources, though they also raise questions about the balance between international engagement and the development of indigenous innovation capabilities. Insert Visualization 7 (Bar Chart: Domestic vs. International Collaboration in Research Projects)

The regional dimensions of innovation activities reveal both opportunities and challenges. While the concentration of research in urban centers leverages existing infrastructure and human capital, it may also reinforce regional disparities. The emergence of specialized innovation clusters in different regions represents a promising development that could contribute to more balanced territorial development.

## Implications, Opinions, and Future Outlook

The data presented in this report has several important implications for the future of ${topic.toLowerCase()} in ${location}. In my assessment, the country is making meaningful progress in strengthening its innovation ecosystem, though challenges remain in areas such as commercialization of research outputs, scale-up of innovative ventures, and broader societal engagement with innovation processes.

The increasing investment and patent activity suggest a positive trajectory that could enhance ${location}'s position in the global innovation landscape. However, sustained effort will be required to translate these inputs and intermediate outputs into tangible economic and social benefits. This includes developing more robust mechanisms for technology transfer, improving access to risk capital for innovative ventures, and fostering entrepreneurial culture within research institutions.

Looking forward, I believe that several factors will shape the evolution of ${topic.toLowerCase()} in ${location} in the coming years:

The digital transformation will continue to drive innovation across sectors, creating new interfaces between traditional industries and emerging technologies such as artificial intelligence, blockchain, and the Internet of Things.

Sustainability concerns and climate change imperatives will intensify focus on green innovation, circular economy solutions, and clean energy technologies.

Demographic changes, including population aging in many developed regions, will generate innovation challenges and opportunities in healthcare, social services, and workforce development.

Geopolitical dynamics and supply chain reconfiguration will influence innovation priorities related to strategic autonomy, resource security, and industrial resilience.

For ${location} to navigate these trends effectively, policy coherence between innovation, education, industrial, and trade measures will be crucial. Additionally, broader societal engagement with innovation processes can help ensure that technological developments align with citizen needs and values.

## Conclusion

The analysis of ${topic} in ${location} during ${year} reveals a dynamic innovation ecosystem with increasing resources, growing outputs, and evolving patterns of collaboration and specialization. The country has demonstrated commitment to enhancing its innovative capacity through strategic investments, policy initiatives, and institutional developments.

The data indicates progress in key metrics such as R&D investment, patent applications, and research collaborations. These positive trends provide a foundation for future development, though continued attention is needed to address remaining challenges in commercialization, regional balance, and inclusive innovation.

As ${location} looks toward the future, the trajectory of ${topic.toLowerCase()} will be influenced by both domestic priorities and global trends. By building on current strengths, addressing systemic weaknesses, and embracing emerging opportunities, ${location} can enhance its position in the global innovation landscape while generating economic and social benefits for its citizens.`;
  };

  const generateGeneralReportPT = (topic: string, location: string, year: string, style: string) => {
    return `# ${topic} em ${location} (${year})

## Introdução

Este relatório examina ${topic} em ${location} durante ${year}, fornecendo uma análise abrangente dos principais desenvolvimentos, tendências e implicações. À medida que navegamos em um cenário de inovação cada vez mais complexo, compreender a dinâmica de ${topic} em ${location} torna-se essencial para formuladores de políticas, pesquisadores e partes interessadas da indústria.

A importância desta análise se estende além do mero interesse acadêmico. Ela fornece insights valiosos sobre como ${location} está se posicionando no ecossistema global de inovação, particularmente no contexto de rápida mudança tecnológica e transformação econômica. As descobertas apresentadas aqui podem informar decisões estratégicas, formulações de políticas e direções futuras de pesquisa.

Nas seções a seguir, exploraremos o contexto histórico de ${topic} em ${location}, apresentaremos pontos de dados chave de ${year}, analisaremos padrões emergentes e ofereceremos perspectivas sobre possíveis desenvolvimentos futuros.

## Contexto e Antecedentes

${location} tem uma rica história de inovação e desenvolvimento tecnológico, moldada por seus fatores geográficos, culturais e econômicos únicos. A abordagem do país para ${topic.toLowerCase()} evoluiu significativamente ao longo das décadas, influenciada tanto por prioridades domésticas quanto por tendências internacionais.

Nos últimos anos, ${location} intensificou seu foco em ${topic.toLowerCase()} como parte de uma estratégia mais ampla para aumentar a competitividade econômica, enfrentar desafios sociais e alcançar objetivos de desenvolvimento sustentável. Esta ênfase se reflete em várias políticas nacionais, programas de financiamento e arranjos institucionais projetados para fomentar a inovação em múltiplos setores.

O período que antecedeu ${year} testemunhou vários desenvolvimentos importantes que setam o terreno para o cenário atual. Estes incluem reformas estruturais no sistema de pesquisa e inovação, maior colaboração entre academia e indústria, e investimentos estratégicos em áreas-chave de tecnologia.

O contexto mais amplo para ${topic.toLowerCase()} em ${location} também inclui tendências demográficas, resultados educacionais, desenvolvimento de infraestrutura e disparidades regionais. Estes fatores interagem de maneiras complexas para moldar a capacidade de inovação e a distribuição de seus benefícios entre diferentes segmentos da sociedade.

## Visão Geral dos Dados

De acordo com nossa base de dados, o investimento total em pesquisa e desenvolvimento relacionado a ${topic.toLowerCase()} em ${location} atingiu €345 milhões em ${year}, representando um aumento de 12,8% em relação ao ano anterior. Este crescimento excede a taxa média nacional de crescimento de investimento em P&D de 7,5% em todos os setores. Insert Visualization 1 (Gráfico de Barras: Investimento em P&D em ${topic} nos Últimos Cinco Anos)

A distribuição setorial deste investimento revela padrões interessantes. Tecnologias de informação e comunicação receberam a maior parcela, com 32% do financiamento total, seguidas por ciências da saúde (23%), tecnologias de energia sustentável (18%), manufatura avançada (15%) e outros setores, incluindo agricultura e transporte (12%). Insert Visualization 2 (Gráfico de Pizza: Distribuição Setorial de Financiamento de ${topic})

Pedidos de patentes relacionados a ${topic.toLowerCase()} de pesquisadores e organizações baseados em ${location} totalizaram 156 em ${year}, marcando um aumento de 15% em relação ao ano anterior. Particularmente notável é o crescimento em patentes relacionadas a tecnologias digitais, inovações biomédicas e soluções de energia limpa. Insert Visualization 3 (Gráfico de Linha: Pedidos de Patentes em Áreas de ${topic} ${Number(year) - 4}-${year})

O número de projetos de pesquisa ativos focados em ${topic.toLowerCase()} em ${location} durante ${year} foi de 312, com projetos colaborativos envolvendo parceiros internacionais representando 58% do total. Estes projetos abrangem vários níveis de prontidão tecnológica, com 40% focados em pesquisa aplicada e 35% on desenvolvimento experimental. Insert Visualization 4 (Gráfico de Barras: Projetos de Pesquisa por Nível de Prontidão Tecnológica)

Quanto à distribuição regional, os dados indicam alguma concentração de atividades de inovação em grandes centros urbanos, com a região da capital respondendo por 45% dos
