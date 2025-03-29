import { supabase } from "@/integrations/supabase/client";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { BarChart, LineChart, PieChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Pie, Cell } from "recharts";

// Types
export interface AIGeneratedReport {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id?: string | null;
  language: string;
  metadata?: {
    topic?: string;
    generationMethod?: string;
    additionalInstructions?: string | null;
  } | null;
  chart_data?: any;
  report_type?: string | null;
  file_url?: string | null;
}

export interface ReportTopic {
  title: string;
  description: string;
  key_points: string[];
}

export interface Visualization {
  type: 'bar' | 'line' | 'pie';
  title: string;
  description: string;
  data: any[];
  colors?: string[];
}

// Report Topic Generator
export const generateReportTopics = (topic: string, language: string): ReportTopic[] => {
  console.log(`Generating topics for ${topic} in ${language}`);
  const isPortuguese = language === 'pt';

  // Sample topics based on common business report structures
  const topics: ReportTopic[] = [
    {
      title: isPortuguese ? "Visão Geral e Contexto" : "Overview and Context",
      description: isPortuguese 
        ? "Introdução e contextualização geral do tópico"
        : "Introduction and general context about the topic",
      key_points: []
    },
    {
      title: isPortuguese ? "Análise de Mercado e Tendências" : "Market Analysis and Trends",
      description: isPortuguese
        ? "Avaliação do cenário atual e tendências futuras"
        : "Evaluation of current scenario and future trends",
      key_points: []
    },
    {
      title: isPortuguese ? "Principais Desafios e Oportunidades" : "Key Challenges and Opportunities",
      description: isPortuguese
        ? "Identificação de obstáculos e potenciais áreas de crescimento"
        : "Identification of obstacles and potential growth areas",
      key_points: []
    },
    {
      title: isPortuguese ? "Estratégias e Melhores Práticas" : "Strategies and Best Practices",
      description: isPortuguese
        ? "Recomendações de abordagens e metodologias"
        : "Recommended approaches and methodologies",
      key_points: []
    },
    {
      title: isPortuguese ? "Métricas e Indicadores Chave" : "Key Metrics and Indicators",
      description: isPortuguese
        ? "Análise de dados e métricas relevantes"
        : "Analysis of relevant data and metrics",
      key_points: []
    },
    {
      title: isPortuguese ? "Conclusões e Recomendações" : "Conclusions and Recommendations",
      description: isPortuguese
        ? "Síntese e passos futuros recomendados"
        : "Summary and recommended future steps",
      key_points: []
    }
  ];

  return topics;
};

export const generateTopicContent = (topic: ReportTopic, mainTopic: string, language: string): string => {
  console.log(`Generating content for ${topic.title} with main topic ${mainTopic} in ${language}`);
  const isPortuguese = language === 'pt';
  
  let content = `## ${topic.title}\n\n`;
  
  // Add topic introduction based on its description
  content += `${topic.description}.\n\n`;
  
  // Generate dummy paragraphs specific to each topic type
  if (topic.title.includes("Overview") || topic.title.includes("Visão Geral")) {
    content += generateOverviewContent(mainTopic, language);
  } else if (topic.title.includes("Market") || topic.title.includes("Mercado")) {
    content += generateMarketAnalysisContent(mainTopic, language);
  } else if (topic.title.includes("Challenges") || topic.title.includes("Desafios")) {
    content += generateChallengesContent(mainTopic, language);
  } else if (topic.title.includes("Strategies") || topic.title.includes("Estratégias")) {
    content += generateStrategiesContent(mainTopic, language);
  } else if (topic.title.includes("Metrics") || topic.title.includes("Métricas")) {
    content += generateMetricsContent(mainTopic, language);
  } else if (topic.title.includes("Conclusions") || topic.title.includes("Conclusões")) {
    content += generateConclusionsContent(mainTopic, language);
  }
  
  return content;
};

// Helper functions to generate section content
const generateOverviewContent = (topic: string, language: string): string => {
  const isPortuguese = language === 'pt';
  
  let content = '';
  
  content += isPortuguese
    ? `O tema ${topic} tem assumido cada vez mais importância no contexto atual, tanto nacional quanto globalmente. A evolução histórica deste tópico demonstra uma trajetória de crescente relevância estratégica para diversos setores econômicos.\n\n`
    : `The subject of ${topic} has become increasingly important in the current context, both nationally and globally. The historical evolution of this topic demonstrates a trajectory of increasing strategic relevance for various economic sectors.\n\n`;
  
  content += isPortuguese
    ? `Considerando o panorama atual, observa-se que os principais atores envolvidos buscam constantemente inovação e adaptação às mudanças do mercado. O ecossistema completo envolve stakeholders dos setores público e privado, cada um com seus interesses e contribuições específicas.\n\n`
    : `Considering the current landscape, it's observed that the main actors involved constantly seek innovation and adaptation to market changes. The complete ecosystem involves stakeholders from both public and private sectors, each with specific interests and contributions.\n\n`;
  
  content += isPortuguese
    ? `[Visualization: bar-chart;Evolução do Interesse em ${topic};Tendência de interesse ao longo do tempo;years:2019,2020,2021,2022,2023;values:42,56,75,85,95;color:#4C9AFF]\n\n`
    : `[Visualization: bar-chart;Evolution of Interest in ${topic};Trend of interest over time;years:2019,2020,2021,2022,2023;values:42,56,75,85,95;color:#4C9AFF]\n\n`;
  
  content += isPortuguese
    ? `A compreensão do contexto é fundamental para uma análise aprofundada e para o desenvolvimento de estratégias eficazes. Os dados mostram claramente um aumento no interesse e investimento nesta área, o que sugere um reconhecimento generalizado de sua importância estratégica.\n\n`
    : `Understanding the context is fundamental for an in-depth analysis and for developing effective strategies. The data clearly shows an increase in interest and investment in this area, suggesting a widespread recognition of its strategic importance.\n\n`;
  
  return content;
};

const generateMarketAnalysisContent = (topic: string, language: string): string => {
  const isPortuguese = language === 'pt';
  
  let content = '';
  
  content += isPortuguese
    ? `A análise do mercado relacionado a ${topic} revela tendências significativas que estão moldando o setor. Nos últimos anos, observou-se uma transformação acelerada impulsionada pela digitalização e pela adoção de novas tecnologias.\n\n`
    : `The market analysis related to ${topic} reveals significant trends that are shaping the sector. In recent years, an accelerated transformation has been observed, driven by digitalization and the adoption of new technologies.\n\n`;
  
  content += isPortuguese
    ? `Um dos principais indicadores é a distribuição do mercado entre diferentes segmentos. Esta segmentação permite identificar nichos de maior crescimento e oportunidades ainda não exploradas adequadamente.\n\n`
    : `One of the main indicators is the market distribution among different segments. This segmentation allows for identifying niches with higher growth and opportunities not yet adequately explored.\n\n`;
  
  content += isPortuguese
    ? `[Visualization: pie-chart;Distribuiç��o do Mercado;Segmentação por setor em ${topic};segments:Tecnologia,Saúde,Energia,Manufatura,Serviços;values:35,20,15,15,15;colors:#36B37E,#00B8D9,#6554C0,#FF5630,#FFAB00]\n\n`
    : `[Visualization: pie-chart;Market Distribution;Segmentation by sector in ${topic};segments:Technology,Healthcare,Energy,Manufacturing,Services;values:35,20,15,15,15;colors:#36B37E,#00B8D9,#6554C0,#FF5630,#FFAB00]\n\n`;
  
  content += isPortuguese
    ? `As projeções indicam que o crescimento continuará em ritmo acelerado nos próximos cinco anos, com uma taxa composta de crescimento anual (CAGR) estimada em 12-15%. Este crescimento será impulsionado principalmente pela inovação contínua e pela expansão para mercados emergentes.\n\n`
    : `Projections indicate that growth will continue at an accelerated pace over the next five years, with an estimated compound annual growth rate (CAGR) of 12-15%. This growth will be driven mainly by continuous innovation and expansion into emerging markets.\n\n`;
  
  content += isPortuguese
    ? `A competição no mercado é intensa, com players estabelecidos e novos entrantes disputando participação. As barreiras de entrada variam conforme o segmento, sendo mais altas em áreas que exigem maior capital e conhecimento técnico especializado.\n\n`
    : `Competition in the market is intense, with established players and new entrants competing for market share. Entry barriers vary according to the segment, being higher in areas that require greater capital and specialized technical knowledge.\n\n`;
  
  return content;
};

const generateChallengesContent = (topic: string, language: string): string => {
  const isPortuguese = language === 'pt';
  
  let content = '';
  
  content += isPortuguese
    ? `No contexto atual de ${topic}, diversos desafios críticos precisam ser enfrentados para garantir o desenvolvimento sustentável e contínuo. Estes obstáculos representam tanto ameaças quanto oportunidades para inovação e diferenciação no mercado.\n\n`
    : `In the current context of ${topic}, several critical challenges need to be addressed to ensure sustainable and continuous development. These obstacles represent both threats and opportunities for innovation and differentiation in the market.\n\n`;
  
  content += isPortuguese
    ? `Entre os principais desafios destacam-se:\n\n- **Regulamentação e compliance**: Adaptar-se às constantes mudanças regulatórias e garantir conformidade.\n- **Transformação digital**: Implementar e otimizar processos digitais em toda a cadeia de valor.\n- **Sustentabilidade**: Equilibrar crescimento econômico com responsabilidade ambiental e social.\n- **Atração e retenção de talentos**: Competir por profissionais qualificados em um mercado competitivo.\n- **Gestão da inovação**: Manter-se à frente da curva de inovação sem dispersar recursos.\n\n`
    : `Among the main challenges are:\n\n- **Regulation and compliance**: Adapting to constant regulatory changes and ensuring compliance.\n- **Digital transformation**: Implementing and optimizing digital processes throughout the value chain.\n- **Sustainability**: Balancing economic growth with environmental and social responsibility.\n- **Talent attraction and retention**: Competing for qualified professionals in a competitive market.\n- **Innovation management**: Staying ahead of the innovation curve without dispersing resources.\n\n`;
  
  content += isPortuguese
    ? `Ao mesmo tempo, oportunidades significativas emergem destes desafios:\n\n- **Novos modelos de negócio**: Desenvolver abordagens inovadoras que atendam às mudanças nas expectativas dos clientes.\n- **Parcerias estratégicas**: Colaborar com stakeholders complementares para criar valor adicional.\n- **Mercados inexplorados**: Identificar e desenvolver segmentos ainda não atendidos adequadamente.\n\n`
    : `At the same time, significant opportunities emerge from these challenges:\n\n- **New business models**: Developing innovative approaches that meet changing customer expectations.\n- **Strategic partnerships**: Collaborating with complementary stakeholders to create additional value.\n- **Unexplored markets**: Identifying and developing segments not yet adequately served.\n\n`;
  
  content += isPortuguese
    ? `[Visualization: bar-chart;Principais Obstáculos ao Crescimento;Fatores limitantes identificados por especialistas;factors:Regulamentação,Financiamento,Talentos,Tecnologia,Competição;values:85,75,65,60,55;color:#FF5630]\n\n`
    : `[Visualization: bar-chart;Main Growth Obstacles;Limiting factors identified by experts;factors:Regulation,Funding,Talent,Technology,Competition;values:85,75,65,60,55;color:#FF5630]\n\n`;
  
  content += isPortuguese
    ? `A capacidade de transformar estes desafios em vantagens competitivas será determinante para o sucesso futuro das organizações neste setor. Uma abordagem proativa e adaptativa é essencial neste contexto de rápidas mudanças.\n\n`
    : `The ability to transform these challenges into competitive advantages will be decisive for the future success of organizations in this sector. A proactive and adaptive approach is essential in this context of rapid changes.\n\n`;
  
  return content;
};

const generateStrategiesContent = (topic: string, language: string): string => {
  const isPortuguese = language === 'pt';
  
  let content = '';
  
  content += isPortuguese
    ? `Para navegar com sucesso no complexo cenário de ${topic}, é fundamental desenvolver e implementar estratégias robustas e adaptáveis. As melhores práticas identificadas são resultado de análises aprofundadas de casos de sucesso e tendências emergentes.\n\n`
    : `To successfully navigate the complex landscape of ${topic}, it is essential to develop and implement robust and adaptable strategies. The best practices identified are the result of in-depth analyses of success cases and emerging trends.\n\n`;
  
  content += isPortuguese
    ? `### Estratégias Recomendadas\n\n1. **Abordagem centrada no cliente**: Priorizar a compreensão profunda das necessidades e expectativas dos clientes, utilizando dados para personalizar soluções.\n\n2. **Inovação colaborativa**: Estabelecer ecossistemas de parceiros para acelerar a inovação e compartilhar riscos de desenvolvimento.\n\n3. **Desenvolvimento ágil**: Adotar metodologias ágeis para responder rapidamente às mudanças do mercado e otimizar recursos.\n\n4. **Escalabilidade planejada**: Construir infraestrutura e processos que suportem crescimento sem comprometer qualidade ou eficiência.\n\n5. **Sustentabilidade integrada**: Incorporar práticas sustentáveis como parte fundamental da estratégia de negócios.\n\n`
    : `### Recommended Strategies\n\n1. **Customer-centric approach**: Prioritize deep understanding of customer needs and expectations, using data to personalize solutions.\n\n2. **Collaborative innovation**: Establish partner ecosystems to accelerate innovation and share development risks.\n\n3. **Agile development**: Adopt agile methodologies to respond quickly to market changes and optimize resources.\n\n4. **Planned scalability**: Build infrastructure and processes that support growth without compromising quality or efficiency.\n\n5. **Integrated sustainability**: Incorporate sustainable practices as a fundamental part of business strategy.\n\n`;
  
  content += isPortuguese
    ? `### Implementação Eficaz\n\nA implementação bem-sucedida destas estratégias requer:\n\n- **Alinhamento organizacional**: Garantir que toda a organização compreenda e esteja comprometida com as estratégias definidas.\n\n- **Métricas claras**: Estabelecer KPIs específicos para monitorar progresso e resultados.\n\n- **Revisão contínua**: Avaliar regularmente a eficácia das estratégias e fazer ajustes conforme necessário.\n\n`
    : `### Effective Implementation\n\nSuccessful implementation of these strategies requires:\n\n- **Organizational alignment**: Ensure that the entire organization understands and is committed to the defined strategies.\n\n- **Clear metrics**: Establish specific KPIs to monitor progress and results.\n\n- **Continuous review**: Regularly evaluate the effectiveness of strategies and make adjustments as necessary.\n\n`;
  
  content += isPortuguese
    ? `[Visualization: line-chart;Eficácia das Estratégias;Impacto relativo de diferentes abordagens;strategies:Cliente,Inovação,Agilidade,Escala,Sustentabilidade;values:90,85,80,75,70;color:#36B37E]\n\n`
    : `[Visualization: line-chart;Strategy Effectiveness;Relative impact of different approaches;strategies:Customer,Innovation,Agility,Scale,Sustainability;values:90,85,80,75,70;color:#36B37E]\n\n`;
  
  content += isPortuguese
    ? `A adoção destas estratégias deve ser contextualizada e adaptada às especificidades de cada organização, considerando sua cultura, recursos disponíveis e posicionamento no mercado. Não existe uma abordagem única que funcione em todos os casos.\n\n`
    : `The adoption of these strategies should be contextualized and adapted to the specificities of each organization, considering its culture, available resources, and market positioning. There is no single approach that works in all cases.\n\n`;
  
  return content;
};

const generateMetricsContent = (topic: string, language: string): string => {
  const isPortuguese = language === 'pt';
  
  let content = '';
  
  content += isPortuguese
    ? `Monitorar e analisar métricas relevantes é essencial para avaliar o desempenho e orientar decisões estratégicas no contexto de ${topic}. Os indicadores-chave devem estar alinhados com os objetivos estratégicos e fornecer insights acionáveis.\n\n`
    : `Monitoring and analyzing relevant metrics is essential to evaluate performance and guide strategic decisions in the context of ${topic}. Key indicators should be aligned with strategic objectives and provide actionable insights.\n\n`;
  
  content += isPortuguese
    ? `### Indicadores Financeiros\n\n- **Retorno sobre Investimento (ROI)**: Mede a eficiência dos investimentos realizados.\n- **Taxa de Crescimento Anual**: Indica a velocidade de expansão do negócio ou mercado.\n- **Margem de Contribuição**: Avalia a rentabilidade após custos variáveis.\n\n`
    : `### Financial Indicators\n\n- **Return on Investment (ROI)**: Measures the efficiency of investments made.\n- **Annual Growth Rate**: Indicates the speed of business or market expansion.\n- **Contribution Margin**: Evaluates profitability after variable costs.\n\n`;
  
  content += isPortuguese
    ? `### Indicadores Operacionais\n\n- **Eficiência Produtiva**: Avalia a relação entre recursos utilizados e resultados obtidos.\n- **Tempo de Ciclo**: Mede a duração total de processos críticos.\n- **Taxa de Defeitos**: Monitora a qualidade dos produtos ou serviços.\n\n`
    : `### Operational Indicators\n\n- **Productive Efficiency**: Evaluates the relationship between resources used and results obtained.\n- **Cycle Time**: Measures the total duration of critical processes.\n- **Defect Rate**: Monitors the quality of products or services.\n\n`;
  
  content += isPortuguese
    ? `[Visualization: line-chart;Evolução de Indicadores-Chave;Tendências ao longo do tempo;years:2019,2020,2021,2022,2023;ROI:12,15,18,22,25;Crescimento:8,10,15,18,20;Margem:20,22,25,28,30;colors:#36B37E,#00B8D9,#6554C0]\n\n`
    : `[Visualization: line-chart;Key Indicator Evolution;Trends over time;years:2019,2020,2021,2022,2023;ROI:12,15,18,22,25;Growth:8,10,15,18,20;Margin:20,22,25,28,30;colors:#36B37E,#00B8D9,#6554C0]\n\n`;
  
  content += isPortuguese
    ? `### Análise Comparativa\n\nA comparação com benchmarks do setor revela oportunidades de melhoria e vantagens competitivas. Atualmente, as organizações líderes atingem:\n\n- ROI médio de 25-30%\n- Crescimento anual de 15-20%\n- Eficiência operacional 30% superior à média do mercado\n\n`
    : `### Comparative Analysis\n\nComparison with industry benchmarks reveals opportunities for improvement and competitive advantages. Currently, leading organizations achieve:\n\n- Average ROI of 25-30%\n- Annual growth of 15-20%\n- Operational efficiency 30% higher than the market average\n\n`;
  
  content += isPortuguese
    ? `A implementação de sistemas robustos de análise de dados permite não apenas monitorar estas métricas, mas também identificar correlações e tendências que podem orientar decisões estratégicas futuras. O uso de dashboards interativos facilita a visualização e interpretação destes dados.\n\n`
    : `The implementation of robust data analysis systems allows not only monitoring these metrics but also identifying correlations and trends that can guide future strategic decisions. The use of interactive dashboards facilitates the visualization and interpretation of this data.\n\n`;
  
  return content;
};

const generateConclusionsContent = (topic: string, language: string): string => {
  const isPortuguese = language === 'pt';
  
  let content = '';
  
  content += isPortuguese
    ? `A análise abrangente de ${topic} realizada neste relatório permite extrair conclusões significativas e formular recomendações baseadas em evidências. As perspectivas apresentadas fornecem uma base sólida para a tomada de decisões estratégicas.\n\n`
    : `The comprehensive analysis of ${topic} conducted in this report allows for extracting significant conclusions and formulating evidence-based recommendations. The perspectives presented provide a solid foundation for strategic decision-making.\n\n`;
  
  content += isPortuguese
    ? `### Principais Conclusões\n\n1. O cenário atual de ${topic} apresenta tanto desafios significativos quanto oportunidades promissoras, exigindo abordagens adaptativas e inovadoras.\n\n2. As organizações que adotam estratégias centradas no cliente e orientadas por dados tendem a superar significativamente seus concorrentes.\n\n3. A transformação digital e a sustentabilidade emergem como fatores críticos de sucesso a longo prazo, independentemente do segmento específico.\n\n4. As métricas demonstram tendências positivas consistentes para organizações que implementam as melhores práticas identificadas neste estudo.\n\n`
    : `### Main Conclusions\n\n1. The current landscape of ${topic} presents both significant challenges and promising opportunities, requiring adaptive and innovative approaches.\n\n2. Organizations that adopt customer-centric and data-driven strategies tend to significantly outperform their competitors.\n\n3. Digital transformation and sustainability emerge as critical factors for long-term success, regardless of the specific segment.\n\n4. Metrics demonstrate consistent positive trends for organizations that implement the best practices identified in this study.\n\n`;
  
  content += isPortuguese
    ? `### Recomendações Estratégicas\n\n1. **Desenvolver capacidades digitais**: Investir em tecnologias e competências que permitam aproveitamento pleno de dados e automação de processos.\n\n2. **Adotar modelos ágeis**: Implementar estruturas organizacionais e metodologias que favoreçam adaptabilidade e resposta rápida às mudanças.\n\n3. **Estabelecer parcerias estratégicas**: Formar alianças com organizações complementares para expandir capacidades e acessar novos mercados.\n\n4. **Investir em sustentabilidade**: Integrar práticas ambientais e socialmente responsáveis como elemento central da estratégia.\n\n5. **Cultivar cultura de inovação**: Criar ambientes que estimulem experimentação, aprendizado contínuo e desenvolvimento de novas soluções.\n\n`
    : `### Strategic Recommendations\n\n1. **Develop digital capabilities**: Invest in technologies and skills that allow full utilization of data and process automation.\n\n2. **Adopt agile models**: Implement organizational structures and methodologies that favor adaptability and rapid response to changes.\n\n3. **Establish strategic partnerships**: Form alliances with complementary organizations to expand capabilities and access new markets.\n\n4. **Invest in sustainability**: Integrate environmentally and socially responsible practices as a central element of strategy.\n\n5. **Cultivate innovation culture**: Create environments that stimulate experimentation, continuous learning, and development of new solutions.\n\n`;
  
  content += isPortuguese
    ? `[Visualization: bar-chart;Impacto Esperado das Recomendações;Potencial de melhoria percentual;areas:Digital,Agilidade,Parcerias,Sustentabilidade,Inovação;values:45,35,30,40,50;color:#00B8D9]\n\n`
    : `[Visualization: bar-chart;Expected Impact of Recommendations;Potential percentage improvement;areas:Digital,Agility,Partnerships,Sustainability,Innovation;values:45,35,30,40,50;color:#00B8D9]\n\n`;
  
  content += isPortuguese
    ? `A implementação bem-sucedida destas recomendações requer comprometimento da liderança, alocação adequada de recursos e monitoramento contínuo de resultados. As organizações devem priorizar iniciativas com base em seu contexto específico e objetivos estratégicos.\n\n`
    : `Successful implementation of these recommendations requires leadership commitment, adequate resource allocation, and continuous monitoring of results. Organizations should prioritize initiatives based on their specific context and strategic objectives.\n\n`;
  
  content += isPortuguese
    ? `O futuro de ${topic} será definido por aqueles que conseguirem equilibrar visão estratégica com execução disciplinada, adaptando-se continuamente às mudanças do ambiente enquanto mantêm foco em seus valores fundamentais e proposição de valor única.\n\n`
    : `The future of ${topic} will be defined by those who can balance strategic vision with disciplined execution, continuously adapting to changes in the environment while maintaining focus on their core values and unique value proposition.\n\n`;
  
  return content;
};

// Database functions
export const fetchReports = async (language: string): Promise<AIGeneratedReport[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_generated_reports')
      .select('*')
      .eq('language', language)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }

    return data as AIGeneratedReport[];
  } catch (error) {
    console.error("Error in fetchReports:", error);
    return [];
  }
};

export const deleteReport = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('ai_generated_reports')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting report:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteReport:", error);
    throw error;
  }
};

export interface SaveReportData {
  title: string;
  content: string;
  language: string;
  user_id?: string | null;
  metadata?: any;
  chart_data?: any;
  report_type?: string | null;
  file_url?: string | null;
}

export const saveReport = async (reportData: SaveReportData): Promise<AIGeneratedReport> => {
  try {
    console.log("Saving report with data:", reportData);
    
    // Ensure the report has a unique ID if not provided
    const reportToSave = {
      ...reportData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('ai_generated_reports')
      .insert(reportToSave)
      .select()
      .single();

    if (error) {
      console.error("Error saving report to database:", error);
      throw error;
    }

    if (!data) {
      throw new Error("No data returned after saving report");
    }

    console.log("Report saved successfully:", data);
    
    // Store in session storage for immediate access
    sessionStorage.setItem('currentReport', JSON.stringify(data));
    
    return data as AIGeneratedReport;
  } catch (error) {
    console.error("Error in saveReport:", error);
    
    // For development or if database is not available, create a local report
    const tempReport: AIGeneratedReport = {
      id: `dev-${Date.now()}`,
      title: reportData.title,
      content: reportData.content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      language: reportData.language,
      user_id: reportData.user_id,
      metadata: reportData.metadata,
      chart_data: reportData.chart_data,
      report_type: reportData.report_type,
      file_url: reportData.file_url
    };
    
    // Store in session storage for immediate access
    sessionStorage.setItem('currentReport', JSON.stringify(tempReport));
    
    console.log("Created temporary report:", tempReport);
    return tempReport;
  }
};

export const assembleFullReport = (title: string, topics: ReportTopic[], contents: string[]): string => {
  console.log(`Assembling full report titled "${title}" with ${topics.length} topics and ${contents.length} content sections`);
  
  let fullReport = `# ${title}\n\n`;
  
  // Add an introduction
  fullReport += `## Introduction\n\nThis report provides a comprehensive analysis and insights on ${title.split(' - ')[0]}. The following sections cover various aspects of the topic, including market analysis, challenges, strategies, and recommendations.\n\n`;
  
  // Add each content section
  contents.forEach((content, index) => {
    if (index < topics.length) {
      fullReport += content + "\n\n";
    }
  });
  
  return fullReport;
};

export const generatePDF = async (report: AIGeneratedReport): Promise<string> => {
  try {
    console.log("Generating PDF for report:", report.title);
    
    // Extract visualizations from the report content
    const visualizations = extractVisualizations(report.content || '');
    console.log(`Found ${visualizations.length} visualizations to include in PDF`);
    
    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add title
    pdf.setFontSize(22);
    pdf.text(report.title, 20, 30);
    
    // Add metadata
    pdf.setFontSize(12);
    pdf.text(`Report ID: ${report.id}`, 20, 45);
    pdf.text(`Generated: ${new Date(report.created_at).toLocaleDateString()}`, 20, 55);
    if (report.report_type) {
      pdf.text(`Type: ${report.report_type}`, 20, 65);
    }
    
    // Add content
    pdf.setFontSize(16);
    pdf.text("Report Content", 20, 85);
    
    pdf.setFontSize(12);
    let yPosition = 95;
    
    // Process the content to handle markdown formatting and visualizations
    let contentSegments: string[] = [];
    
    if (report.content) {
      // Replace visualization tags with markers for positioning
      let processedContent = report.content;
      let vizIndex = 0;
      processedContent = processedContent.replace(/\[Visualization:[^\]]+\]/g, () => {
        const marker = `[VIZ_PLACEHOLDER_${vizIndex}]`;
        vizIndex++;
        return marker;
      });
      
      // Split content into segments based on visualization markers
      contentSegments = processedContent.split(/\[VIZ_PLACEHOLDER_\d+\]/);
    }
    
    // Add text segments and visualizations
    let vizIndex = 0;
    for (let i = 0; i < contentSegments.length; i++) {
      // Add text segment
      const segment = contentSegments[i]
        .replace(/#+\s(.*)/g, '$1') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold formatting
      
      const textLines = pdf.splitTextToSize(segment, 170);
      for (const line of textLines) {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, 20, yPosition);
        yPosition += 7;
      }
      
      // Add visualization if available
      if (i < contentSegments.length - 1 && vizIndex < visualizations.length) {
        const viz = visualizations[vizIndex];
        vizIndex++;
        
        // Add some space
        yPosition += 10;
        
        if (yPosition > 200) { // If not enough space for chart, move to next page
          pdf.addPage();
          yPosition = 30;
        }
        
        // Add visualization title
        pdf.setFontSize(14);
        pdf.text(viz.title, 20, yPosition);
        yPosition += 10;
        
        // Add visualization description if it exists
        if (viz.description) {
          pdf.setFontSize(10);
          const descriptionLines = pdf.splitTextToSize(viz.description, 170);
          for (const line of descriptionLines) {
            pdf.text(line, 20, yPosition);
            yPosition += 5;
          }
          yPosition += 5;
        }
        
        // Add a placeholder text for the visualization (we can't actually render the charts)
        pdf.setFillColor(240, 240, 240);
        pdf.rect(30, yPosition, 150, 60, 'F');
        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`[${viz.type.toUpperCase()} CHART: ${viz.title}]`, 55, yPosition + 30);
        
        // Reset text color
        pdf.setTextColor(0, 0, 0);
        
        // Move position for next content
        yPosition += 70;
        
        // Reset font size for regular content
        pdf.setFontSize(12);
      }
    }
    
    // Add footer
    pdf.setFontSize(10);
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.text(`Page ${i} of ${totalPages}`, pdf.internal.pageSize.getWidth() / 2, 287, { align: 'center' });
      pdf.text(`ANI Innovation Portal - Generated Report`, 20, 287);
    }
    
    // Convert to base64 and return
    return pdf.output('datauristring');
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
};

export const extractVisualizations = (content: string): Visualization[] => {
  if (!content || typeof content !== 'string') {
    console.log("Invalid content for visualization extraction:", content);
    return [];
  }

  const visualizations: Visualization[] = [];
  const vizRegex = /\[Visualization:([^\]]+)\]/g;
  
  // Create a deterministic seed based on the content to ensure consistent "random" values
  const createSeed = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
  
  // Deterministic random number generator
  const seededRandom = (seed: number, index: number) => {
    const x = Math.sin(seed + index) * 10000;
    return Math.floor((x - Math.floor(x)) * 100);
  };
  
  let match;
  let vizIndex = 0;

  while ((match = vizRegex.exec(content)) !== null) {
    try {
      const vizData = match[1].trim();
      const parts = vizData.split(';');
      const vizSeed = createSeed(vizData); // Create a seed unique to this visualization
      
      if (parts.length < 3) {
        console.warn("Incomplete visualization data:", vizData);
        continue;
      }
      
      const type = parts[0].includes('bar') ? 'bar' : 
                   parts[0].includes('line') ? 'line' : 
                   parts[0].includes('pie') ? 'pie' : 'bar';
      
      const title = parts[1] || 'Visualization';
      const description = parts[2] || '';
      
      // Parse the data based on the visualization type
      let data: any[] = [];
      let colors: string[] = [];
      
      if (type === 'bar' || type === 'line') {
        // For bar and line charts, look for dimension and values
        const xDimension = parts.find(p => p.includes(':'))?.split(':')[0] || 'items';
        const xItems = parts.find(p => p.startsWith(xDimension + ':'))?.split(':')[1]?.split(',') || [];
        
        // Find value dimensions (anything with values after it)
        const valueDimensions = parts
          .filter(p => p.includes(':') && p.split(':')[0] !== xDimension)
          .map(p => p.split(':')[0]);
        
        if (valueDimensions.length === 0) {
          // Simple case: just one value dimension
          let values = parts.find(p => p.startsWith('values:'))?.split(':')[1]?.split(',').map(Number) || [];
          
          // If values aren't provided or are incomplete, generate deterministic values
          if (values.length === 0 || values.length < xItems.length) {
            values = xItems.map((_, idx) => seededRandom(vizSeed, idx));
          }
          
          data = xItems.map((item, index) => ({
            name: item,
            value: values[index] || seededRandom(vizSeed, index)
          }));
        } else {
          // Multiple value dimensions
          data = xItems.map((item, index) => {
            const result: any = { name: item };
            
            valueDimensions.forEach((dim, dimIndex) => {
              const values = parts.find(p => p.startsWith(dim + ':'))?.split(':')[1]?.split(',').map(Number) || [];
              // Use the provided value or generate a deterministic one
              result[dim] = values[index] !== undefined ? values[index] : seededRandom(vizSeed, index + (dimIndex * 100));
            });
            
            return result;
          });
        }
      } else if (type === 'pie') {
        // For pie charts
        const segmentKey = parts.find(p => p.includes('segments:')) ? 'segments' : 'categories';
        const segments = parts.find(p => p.startsWith(segmentKey + ':'))?.split(':')[1]?.split(',') || [];
        let values = parts.find(p => p.startsWith('values:'))?.split(':')[1]?.split(',').map(Number) || [];
        
        // If values aren't provided or are incomplete, generate deterministic values
        if (values.length === 0 || values.length < segments.length) {
          values = segments.map((_, idx) => seededRandom(vizSeed, idx));
        }
        
        data = segments.map((segment, index) => ({
          name: segment,
          value: values[index] || seededRandom(vizSeed, index)
        }));
      }
      
      // Extract colors if provided
      const colorsStr = parts.find(p => p.startsWith('color') || p.startsWith('colors'));
      
      if (colorsStr) {
        const colorValues = colorsStr.split(':')[1];
        colors = colorValues.includes(',') ? colorValues.split(',') : [colorValues];
      } else {
        // Default colors
        colors = ['#36B37E', '#00B8D9', '#6554C0', '#FF5630', '#FFAB00'];
      }
      
      visualizations.push({
        type,
        title,
        description,
        data,
        colors
      });
      
      vizIndex++;
    } catch (err) {
      console.error("Error parsing visualization:", match[0], err);
    }
  }
  
  return visualizations;
};
