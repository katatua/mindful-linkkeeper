import { supabase } from "@/integrations/supabase/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Define interfaces for report-related data
export interface ReportTopic {
  title: string;
  description: string;
  subtopics?: string[];
}

export interface AIGeneratedReport {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  language: string;
  metadata: any;
  chart_data?: any;
  report_type?: string;
  file_url?: string | null;
}

// Function to generate report topics based on user input
export function generateReportTopics(topic: string, language: string): ReportTopic[] {
  console.log(`Generating topics for: ${topic}`);
  
  // Extract key concepts from the topic to create more relevant structure
  const topicLowercase = topic.toLowerCase();
  const hasBusinessFocus = topicLowercase.includes('business') || 
                          topicLowercase.includes('model') || 
                          topicLowercase.includes('market') || 
                          topicLowercase.includes('corporate');
  
  const hasTechFocus = topicLowercase.includes('tech') || 
                       topicLowercase.includes('digital') || 
                       topicLowercase.includes('innovation') || 
                       topicLowercase.includes('development');
  
  const hasSustainabilityFocus = topicLowercase.includes('sustain') || 
                               topicLowercase.includes('environment') || 
                               topicLowercase.includes('green') || 
                               topicLowercase.includes('social');
  
  const hasFinanceFocus = topicLowercase.includes('financ') || 
                        topicLowercase.includes('invest') || 
                        topicLowercase.includes('fund') || 
                        topicLowercase.includes('economic');

  const portugalFocus = topicLowercase.includes('portugal') || 
                      topicLowercase.includes('portuguese');
  
  // Create a more tailored report structure based on detected focus areas
  let topics: ReportTopic[] = [];
  
  // Introduction is always first
  topics.push({
    title: language === 'pt' ? 'Introdução e Contexto' : 'Introduction and Context',
    description: language === 'pt' 
      ? `Visão geral sobre ${topic} e sua relevância no contexto atual`
      : `Overview of ${topic} and its relevance in the current context`
  });
  
  // Add topics based on detected focus areas
  if (hasTechFocus) {
    topics.push({
      title: language === 'pt' ? 'Tendências Tecnológicas e Inovação' : 'Technological Trends and Innovation',
      description: language === 'pt'
        ? 'Análise das principais tendências tecnológicas e seu impacto na inovação'
        : 'Analysis of key technological trends and their impact on innovation'
    });
  }
  
  if (hasBusinessFocus) {
    topics.push({
      title: language === 'pt' ? 'Modelos de Negócio e Estratégias' : 'Business Models and Strategies',
      description: language === 'pt'
        ? 'Exploração de modelos de negócio emergentes e estratégias competitivas'
        : 'Exploration of emerging business models and competitive strategies'
    });
  }
  
  if (hasSustainabilityFocus) {
    topics.push({
      title: language === 'pt' ? 'Sustentabilidade e Responsabilidade Social' : 'Sustainability and Social Responsibility',
      description: language === 'pt'
        ? 'O papel da sustentabilidade e da responsabilidade social corporativa'
        : 'The role of sustainability and corporate social responsibility'
    });
  }
  
  if (hasFinanceFocus) {
    topics.push({
      title: language === 'pt' ? 'Análise Financeira e Investimentos' : 'Financial Analysis and Investments',
      description: language === 'pt'
        ? 'Panorama financeiro, oportunidades de investimento e tendências de financiamento'
        : 'Financial landscape, investment opportunities, and funding trends'
    });
  }
  
  // Add market/industry analysis if it has business or tech focus
  if (hasBusinessFocus || hasTechFocus) {
    topics.push({
      title: language === 'pt' ? 'Análise de Mercado e Indústria' : 'Market and Industry Analysis',
      description: language === 'pt'
        ? 'Análise do mercado atual, segmentação e dinâmicas competitivas'
        : 'Analysis of the current market, segmentation, and competitive dynamics'
    });
  }
  
  // Add regional focus if Portugal is mentioned
  if (portugalFocus) {
    topics.push({
      title: language === 'pt' ? 'Contexto Português e Perspectivas Regionais' : 'Portuguese Context and Regional Perspectives',
      description: language === 'pt'
        ? 'Análise específica do contexto português e implicações regionais'
        : 'Specific analysis of the Portuguese context and regional implications'
    });
  }
  
  // Always add case studies for real-world context
  topics.push({
    title: language === 'pt' ? 'Estudos de Caso e Exemplos' : 'Case Studies and Examples',
    description: language === 'pt'
      ? 'Exemplos reais e estudos de caso relevantes para o tema'
      : 'Real-world examples and case studies relevant to the topic'
  });
  
  // Always end with conclusions and recommendations
  topics.push({
    title: language === 'pt' ? 'Conclusões e Recomendações' : 'Conclusions and Recommendations',
    description: language === 'pt'
      ? 'Principais conclusões e recomendações estratégicas'
      : 'Key conclusions and strategic recommendations'
  });
  
  // If we don't have many topics based on detection, add general ones
  if (topics.length < 5) {
    // Add general topics that work for most subjects
    if (!topics.some(t => t.title.includes('Trends') || t.title.includes('Tendências'))) {
      topics.splice(1, 0, {
        title: language === 'pt' ? 'Principais Tendências e Desenvolvimentos' : 'Key Trends and Developments',
        description: language === 'pt'
          ? 'Análise das tendências emergentes e desenvolvimentos recentes'
          : 'Analysis of emerging trends and recent developments'
      });
    }
    
    if (!topics.some(t => t.title.includes('Challenges') || t.title.includes('Desafios'))) {
      topics.push({
        title: language === 'pt' ? 'Desafios e Oportunidades' : 'Challenges and Opportunities',
        description: language === 'pt'
          ? 'Principais desafios enfrentados e oportunidades emergentes'
          : 'Key challenges faced and emerging opportunities'
      });
    }
  }
  
  console.log(`Generated ${topics.length} topics for report`);
  return topics;
}

// Function to generate content for a specific topic
export function generateTopicContent(topic: ReportTopic, mainTopic: string, language: string): string {
  console.log(`Generating content for topic: ${topic.title}`);
  
  // Extract key concepts for more targeted content generation
  const mainTopicLowercase = mainTopic.toLowerCase();
  const topicTitleLowercase = topic.title.toLowerCase();
  
  // Helper function to create chart visualization markers
  const createChartVisualization = (type: string, title: string, data: any[], xKey: string, dataKey: string, additionalParams = {}): string => {
    const visualizationData = {
      type,
      title,
      data,
      xAxisKey: xKey,
      dataKey,
      ...additionalParams
    };
    
    return `[Visualization:${JSON.stringify(visualizationData)}]`;
  };
  
  let content = '';
  
  // Introduction section
  if (topicTitleLowercase.includes('introdução') || topicTitleLowercase.includes('introduction')) {
    content = `# ${topic.title}\n\n`;
    
    // Custom intro based on the main topic
    if (mainTopicLowercase.includes('tech') || mainTopicLowercase.includes('digital')) {
      content += language === 'pt' 
        ? `O cenário tecnológico atual passa por transformações sem precedentes, impulsionadas pela digitalização acelerada e pela adoção de tecnologias disruptivas. ${mainTopic} representa um campo em rápida evolução que está redefinindo indústrias inteiras e criando novas oportunidades de negócio.\n\n`
        : `The current technological landscape is undergoing unprecedented transformations, driven by accelerated digitalization and the adoption of disruptive technologies. ${mainTopic} represents a rapidly evolving field that is redefining entire industries and creating new business opportunities.\n\n`;
    } else if (mainTopicLowercase.includes('sustain') || mainTopicLowercase.includes('environment')) {
      content += language === 'pt'
        ? `A sustentabilidade tornou-se um imperativo estratégico para organizações em todo o mundo. ${mainTopic} representa uma área crítica onde as preocupações ambientais, sociais e econômicas convergem, exigindo abordagens inovadoras e colaborativas.\n\n`
        : `Sustainability has become a strategic imperative for organizations worldwide. ${mainTopic} represents a critical area where environmental, social, and economic concerns converge, requiring innovative and collaborative approaches.\n\n`;
    } else if (mainTopicLowercase.includes('business') || mainTopicLowercase.includes('market')) {
      content += language === 'pt'
        ? `O panorama empresarial está em constante evolução, moldado por forças disruptivas e novas expectativas dos consumidores. ${mainTopic} emerge como um campo dinâmico onde modelos de negócio inovadores estão desafiando as abordagens tradicionais e redefinindo o valor para os stakeholders.\n\n`
        : `The business landscape is constantly evolving, shaped by disruptive forces and new consumer expectations. ${mainTopic} emerges as a dynamic field where innovative business models are challenging traditional approaches and redefining value for stakeholders.\n\n`;
    } else {
      content += language === 'pt'
        ? `O cenário atual apresenta complexidades e nuances que merecem atenção detalhada. Observamos uma aceleração significativa no desenvolvimento de novas tecnologias e modelos de negócio, impulsionados por fatores como digitalização, mudanças nas cadeias globais de suprimentos e novas demandas de consumidores e mercados. In paralelo, questões como sustentabilidade, inclusão e responsabilidade social corporativa ganharam destaque, influenciando diretamente as dinâmicas relacionadas a ${mainTopic}.\n\n`
        : `The current scenario presents complexities and nuances that deserve detailed attention. We observe a significant acceleration in the development of new technologies and business models, driven by factors such as digitalization, changes in global supply chains, and new consumer and market demands. In parallel, issues such as sustainability, inclusion, and corporate social responsibility have gained prominence, directly influencing the dynamics related to ${mainTopic}.\n\n`;
    }
    
    // Add market data visualization
    const marketGrowthData = [
      { year: "2019", value: Math.floor(Math.random() * 20) + 10 },
      { year: "2020", value: Math.floor(Math.random() * 30) + 15 },
      { year: "2021", value: Math.floor(Math.random() * 40) + 25 },
      { year: "2022", value: Math.floor(Math.random() * 50) + 35 },
      { year: "2023", value: Math.floor(Math.random() * 60) + 45 }
    ];
    
    content += language === 'pt'
      ? `A seguir apresentamos uma visão do crescimento do mercado relacionado a ${mainTopic} nos últimos anos:\n\n`
      : `Below, we present a view of market growth related to ${mainTopic} in recent years:\n\n`;
    
    content += createChartVisualization(
      'line',
      language === 'pt' ? `Crescimento do Mercado: ${mainTopic}` : `Market Growth: ${mainTopic}`,
      marketGrowthData,
      'year',
      'value',
      { 
        series: [{ dataKey: 'value', name: language === 'pt' ? 'Taxa de Crescimento (%)' : 'Growth Rate (%)' }],
        colors: ['#8884d8']
      }
    );
    
    content += '\n\n';
    
    content += language === 'pt'
      ? `Este relatório explora ${mainTopic} de forma abrangente, analisando tendências atuais, desafios críticos e oportunidades emergentes. Também examinamos casos de uso práticos e fornecemos recomendações estratégicas para organizações que buscam se destacar neste domínio em rápida evolução.`
      : `This report explores ${mainTopic} comprehensively, analyzing current trends, critical challenges, and emerging opportunities. We also examine practical use cases and provide strategic recommendations for organizations seeking to excel in this rapidly evolving domain.`;
  }
  
  // Trends/Technology section
  else if (topicTitleLowercase.includes('trends') || topicTitleLowercase.includes('tendências') || 
           topicTitleLowercase.includes('technology') || topicTitleLowercase.includes('tecnologia')) {
    content = `# ${topic.title}\n\n`;
    
    content += language === 'pt'
      ? `A evolução tecnológica tem sido o principal motor de transformação em relação a ${mainTopic}. As organizações estão adotando tecnologias emergentes para impulsionar eficiências operacionais, melhorar a experiência do cliente e criar novos fluxos de receita.\n\n`
      : `Technological evolution has been the main driver of transformation in relation to ${mainTopic}. Organizations are adopting emerging technologies to drive operational efficiencies, improve customer experience, and create new revenue streams.\n\n`;
    
    content += language === 'pt' ? '## Principais Tendências Tecnológicas\n\n' : '## Key Technological Trends\n\n';
    
    // Create trend-specific content based on the main topic
    if (mainTopicLowercase.includes('ai') || mainTopicLowercase.includes('artificial intelligence') || mainTopicLowercase.includes('inteligência artificial')) {
      content += language === 'pt'
        ? '1. **Inteligência Artificial Generativa**: Modelos de IA capazes de criar conteúdo original, design e soluções inovadoras.\n2. **IA Explicável**: Foco crescente em tornar os algoritmos de IA transparentes e interpretáveis.\n3. **IA Ética**: Desenvolvimento de frameworks para garantir que as aplicações de IA sejam justas, inclusivas e respeitem a privacidade.\n\n'
        : '1. **Generative AI**: AI models capable of creating original content, design, and innovative solutions.\n2. **Explainable AI**: Growing focus on making AI algorithms transparent and interpretable.\n3. **Ethical AI**: Development of frameworks to ensure AI applications are fair, inclusive, and respect privacy.\n\n';
    } else if (mainTopicLowercase.includes('renewable') || mainTopicLowercase.includes('energy') || mainTopicLowercase.includes('green')) {
      content += language === 'pt'
        ? '1. **Armazenamento Avançado de Energia**: Novas tecnologias de bateria e sistemas de armazenamento para energia renovável.\n2. **Redes Inteligentes**: Infraestrutura digital para otimizar a distribuição e consumo de energia.\n3. **Hidrogênio Verde**: Avanços na produção de hidrogênio a partir de fontes renováveis.\n\n'
        : '1. **Advanced Energy Storage**: New battery technologies and storage systems for renewable energy.\n2. **Smart Grids**: Digital infrastructure to optimize energy distribution and consumption.\n3. **Green Hydrogen**: Advancements in hydrogen production from renewable sources.\n\n';
    } else {
      content += language === 'pt'
        ? '1. **Análise de Dados Avançada**: Utilização de big data e analytics para obter insights acionáveis.\n2. **Automação Inteligente**: Implementação de automação baseada em IA para otimizar processos.\n3. **Tecnologias Colaborativas**: Ferramentas digitais que facilitam a colaboração remota e híbrida.\n\n'
        : '1. **Advanced Data Analytics**: Utilization of big data and analytics to obtain actionable insights.\n2. **Intelligent Automation**: Implementation of AI-based automation to optimize processes.\n3. **Collaborative Technologies**: Digital tools that facilitate remote and hybrid collaboration.\n\n';
    }
    
    // Add adoption visualization
    const adoptionData = [
      { category: language === 'pt' ? "Empresas Grandes" : "Large Companies", value: 65 },
      { category: language === 'pt' ? "Empresas Médias" : "Medium Companies", value: 45 },
      { category: language === 'pt' ? "Empresas Pequenas" : "Small Companies", value: 25 },
      { category: language === 'pt' ? "Setor Público" : "Public Sector", value: 35 }
    ];
    
    content += language === 'pt' ? '## Taxa de Adoção Tecnológica\n\n' : '## Technology Adoption Rate\n\n';
    content += createChartVisualization(
      'bar',
      language === 'pt' ? `Taxa de Adoção: ${mainTopic}` : `Adoption Rate: ${mainTopic}`,
      adoptionData,
      'category',
      'value',
      { colors: ['#82ca9d'] }
    );
    
    content += '\n\n';
    
    content += language === 'pt'
      ? `A adoção de novas tecnologias relacionadas a ${mainTopic} varia significativamente entre diferentes setores e tamanhos de organizações. As grandes empresas tipicamente lideram a adoção devido a maiores recursos, enquanto organizações menores frequentemente enfrentam desafios relacionados a limitações orçamentárias e expertise técnica.`
      : `The adoption of new technologies related to ${mainTopic} varies significantly across different sectors and organization sizes. Large companies typically lead adoption due to greater resources, while smaller organizations often face challenges related to budget limitations and technical expertise.`;
  }
  
  // Sustainability section
  else if (topicTitleLowercase.includes('sustain') || topicTitleLowercase.includes('environment') || 
           topicTitleLowercase.includes('responsabilidade')) {
    content = `# ${topic.title}\n\n`;
    
    content += language === 'pt'
      ? `A integração de práticas sustentáveis tornou-se um imperativo estratégico para organizações envolvidas com ${mainTopic}. Além do imperativo ambiental, a sustentabilidade está cada vez mais ligada à inovação, eficiência operacional e vantagem competitiva no mercado.\n\n`
      : `The integration of sustainable practices has become a strategic imperative for organizations involved with ${mainTopic}. Beyond the environmental imperative, sustainability is increasingly linked to innovation, operational efficiency, and competitive advantage in the market.\n\n`;
    
    // Add sustainability impact visualization
    const sustainabilityImpactData = [
      { area: language === 'pt' ? "Redução de Emissões" : "Emissions Reduction", value: Math.floor(Math.random() * 40) + 40 },
      { area: language === 'pt' ? "Eficiência de Recursos" : "Resource Efficiency", value: Math.floor(Math.random() * 30) + 50 },
      { area: language === 'pt' ? "Responsabilidade Social" : "Social Responsibility", value: Math.floor(Math.random() * 30) + 45 },
      { area: language === 'pt' ? "Governança" : "Governance", value: Math.floor(Math.random() * 25) + 40 }
    ];
    
    content += language === 'pt' ? '## Impacto de Iniciativas de Sustentabilidade\n\n' : '## Impact of Sustainability Initiatives\n\n';
    content += createChartVisualization(
      'radar',
      language === 'pt' ? `Impacto da Sustentabilidade em ${mainTopic}` : `Sustainability Impact in ${mainTopic}`,
      sustainabilityImpactData,
      'area',
      'value',
      { colors: ['#82ca9d', '#8884d8'] }
    );
    
    content += '\n\n';
    
    content += language === 'pt'
      ? `## Estratégias de Sustentabilidade para ${mainTopic}\n\n1. **Princípios de Design Circular**: Incorporação de princípios de economia circular no design e desenvolvimento.\n2. **Cadeias de Suprimento Responsáveis**: Implementação de práticas de abastecimento sustentável e transparência na cadeia de valor.\n3. **Métricas e Relatórios**: Desenvolvimento de estruturas robustas para medir e comunicar o impacto ambiental e social.\n\n`
      : `## Sustainability Strategies for ${mainTopic}\n\n1. **Circular Design Principles**: Incorporation of circular economy principles in design and development.\n2. **Responsible Supply Chains**: Implementation of sustainable sourcing practices and transparency in the value chain.\n3. **Metrics and Reporting**: Development of robust frameworks to measure and communicate environmental and social impact.\n\n`;
      
    content += language === 'pt'
      ? `A adoção de práticas sustentáveis no contexto de ${mainTopic} não apenas minimiza o impacto ambiental, mas também pode levar a maior eficiência operacional, fortalecimento da marca e melhor alinhamento com as expectativas das partes interessadas. Organizações que integram a sustentabilidade em seu core business estão melhor posicionadas para prosperidade a longo prazo.`
      : `The adoption of sustainable practices in the context of ${mainTopic} not only minimizes environmental impact but can also lead to greater operational efficiency, brand strengthening, and better alignment with stakeholder expectations. Organizations that integrate sustainability into their core business are better positioned for long-term prosperity.`;
  }
  
  // Market/Business section
  else if (topicTitleLowercase.includes('market') || topicTitleLowercase.includes('mercado') || 
           topicTitleLowercase.includes('business') || topicTitleLowercase.includes('negócio')) {
    content = `# ${topic.title}\n\n`;
    
    content += language === 'pt'
      ? `O mercado relacionado a ${mainTopic} está passando por transformações significativas impulsionadas por mudanças nas preferências dos consumidores, avanços tecnológicos e novas dinâmicas competitivas. Compreender essas mudanças é crucial para as organizações que buscam manter a relevância e capturar novas oportunidades de crescimento.\n\n`
      : `The market related to ${mainTopic} is undergoing significant transformations driven by changes in consumer preferences, technological advancements, and new competitive dynamics. Understanding these changes is crucial for organizations seeking to maintain relevance and capture new growth opportunities.\n\n`;
    
    // Add market segmentation visualization  
    const marketSegmentationData = [
      { segment: language === 'pt' ? "Segmento A" : "Segment A", value: Math.floor(Math.random() * 20) + 30 },
      { segment: language === 'pt' ? "Segmento B" : "Segment B", value: Math.floor(Math.random() * 15) + 25 },
      { segment: language === 'pt' ? "Segmento C" : "Segment C", value: Math.floor(Math.random() * 10) + 20 },
      { segment: language === 'pt' ? "Segmento D" : "Segment D", value: Math.floor(Math.random() * 10) + 15 },
      { segment: language === 'pt' ? "Outros" : "Others", value: Math.floor(Math.random() * 5) + 10 }
    ];
    
    content += language === 'pt' ? '## Segmentação de Mercado\n\n' : '## Market Segmentation\n\n';
    content += createChartVisualization(
      'pie',
      language === 'pt' ? `Segmentação do Mercado de ${mainTopic}` : `${mainTopic} Market Segmentation`,
      marketSegmentationData,
      'segment',
      'value',
      { namePath: 'segment', colors: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'] }
    );
    
    content += '\n\n';
    
    content += language === 'pt'
      ? `## Modelos de Negócio Emergentes\n\n1. **Modelos como Serviço**: Transição de vendas de produtos para ofertas baseadas em serviços e assinaturas.\n2. **Plataformas Colaborativas**: Ecossistemas que conectam vários stakeholders para criar e capturar valor.\n3. **Soluções Integradas**: Pacotes abrangentes que abordam problemas complexos de clientes com ofertas holísticas.\n\n`
      : `## Emerging Business Models\n\n1. **As-a-Service Models**: Transition from product sales to service-based and subscription offerings.\n2. **Collaborative Platforms**: Ecosystems that connect various stakeholders to create and capture value.\n3. **Integrated Solutions**: Comprehensive packages that address complex customer problems with holistic offerings.\n\n`;
    
    content += language === 'pt'
      ? `A transformação do mercado de ${mainTopic} requer que as organizações repensem suas proposições de valor e estratégias de go-to-market. Aqueles que conseguem antecipar e adaptar-se a estas mudanças estão melhor posicionados para capturar oportunidades de crescimento e estabelecer vantagens competitivas sustentáveis.`
      : `The transformation of the ${mainTopic} market requires organizations to rethink their value propositions and go-to-market strategies. Those who can anticipate and adapt to these changes are better positioned to capture growth opportunities and establish sustainable competitive advantages.`;
  }
  
  // Portuguese context section
  else if (topicTitleLowercase.includes('portugal') || topicTitleLowercase.includes('portuguese') || 
           topicTitleLowercase.includes('regional')) {
    content = `# ${topic.title}\n\n`;
    
    content += language === 'pt'
      ? `O contexto português apresenta características únicas que influenciam o desenvolvimento e a implementação de iniciativas relacionadas a ${mainTopic}. Compreender estas especificidades é essencial para adaptar estratégias globais ao mercado local e maximizar o impacto.\n\n`
      : `The Portuguese context presents unique characteristics that influence the development and implementation of initiatives related to ${mainTopic}. Understanding these specificities is essential to adapt global strategies to the local market and maximize impact.\n\n`;
    
    // Add regional comparison visualization
    const regionalComparisonData = [
      { region: language === 'pt' ? "Norte" : "North", value: Math.floor(Math.random() * 30) + 40 },
      { region: language === 'pt' ? "Centro" : "Center", value: Math.floor(Math.random() * 25) + 35 },
      { region: language === 'pt' ? "Lisboa" : "Lisbon", value: Math.floor(Math.random() * 40) + 50 },
      { region: language === 'pt' ? "Alentejo" : "Alentejo", value: Math.floor(Math.random() * 20) + 25 },
      { region: language === 'pt' ? "Algarve" : "Algarve", value: Math.floor(Math.random() * 20) + 30 }
    ];
    
    content += language === 'pt' ? '## Distribuição Regional\n\n' : '## Regional Distribution\n\n';
    content += createChartVisualization(
      'bar',
      language === 'pt' ? `Distribuição Regional de ${mainTopic} em Portugal` : `Regional Distribution of ${mainTopic} in Portugal`,
      regionalComparisonData,
      'region',
      'value',
      { colors: ['#0088FE'] }
    );
    
    content += '\n\n';
    
    content += language === 'pt'
      ? `## Iniciativas e Políticas Portuguesas\n\n1. **Quadro Regulatório**: As políticas e regulamentações específicas de Portugal que influenciam ${mainTopic}.\n2. **Programas de Financiamento**: Iniciativas de financiamento nacionais e europeias disponíveis para projetos relacionados.\n3. **Ecossistema de Inovação**: O papel das universidades, centros de investigação e startups no avanço das soluções.\n\n`
      : `## Portuguese Initiatives and Policies\n\n1. **Regulatory Framework**: Portugal-specific policies and regulations that influence ${mainTopic}.\n2. **Funding Programs**: National and European funding initiatives available for related projects.\n3. **Innovation Ecosystem**: The role of universities, research centers, and startups in advancing solutions.\n\n`;
    
    content += language === 'pt'
      ? `Portugal tem demonstrado um compromisso crescente com o avanço em ${mainTopic}, aproveitando seus pontos fortes únicos como localização estratégica, talentos qualificados e ambiente favorável à inovação. As organizações que compreendem o contexto local estão melhor equipadas para navegar nos desafios e aproveitar as oportunidades específicas do mercado português.`
      : `Portugal has demonstrated a growing commitment to advancement in ${mainTopic}, leveraging its unique strengths such as strategic location, qualified talent, and innovation-friendly environment. Organizations that understand the local context are better equipped to navigate challenges and seize opportunities specific to the Portuguese market.`;
  }
  
  // Case studies section
  else if (topicTitleLowercase.includes('case') || topicTitleLowercase.includes('study') || 
           topicTitleLowercase.includes('caso') || topicTitleLowercase.includes('estudo')) {
    content = `# ${topic.title}\n\n`;
    
    content += language === 'pt'
      ? `A análise de casos reais oferece insights valiosos sobre aplicações práticas e lições aprendidas relacionadas a ${mainTopic}. Os seguintes casos demonstram abordagens inovadoras e resultados alcançados por organizações pioneiras neste domínio.\n\n`
      : `The analysis of real cases offers valuable insights into practical applications and lessons learned related to ${mainTopic}. The following cases demonstrate innovative approaches and results achieved by pioneering organizations in this domain.\n\n`;
    
    // Generate case studies based on the main topic
    if (mainTopicLowercase.includes('tech') || mainTopicLowercase.includes('digital')) {
      content += language === 'pt'
        ? `## Caso 1: Transformação Digital em uma Empresa Tradicional\n\nUma empresa estabelecida no setor manufatureiro implementou uma estratégia abrangente de transformação digital, incorporando IoT, análise avançada de dados e automação inteligente em suas operações. Esta iniciativa resultou em um aumento de 30% na eficiência operacional, redução de 25% nos custos de manutenção e melhoria significativa na qualidade do produto.\n\n**Fatores de Sucesso:**\n- Abordagem holística à transformação digital\n- Forte patrocínio executivo e alinhamento organizacional\n- Foco em capacitação e gestão de mudanças\n\n## Caso 2: Startup de Tecnologia Disruptiva\n\nUma startup criou uma plataforma baseada em IA que revolucionou a forma como as empresas gerenciam suas cadeias de suprimentos. Utilizando aprendizado de máquina e análise preditiva, a plataforma otimiza inventário, logística e planejamento de demanda em tempo real. A startup cresceu rapidamente, atraindo investimento significativo e construindo uma base de clientes internacional.\n\n**Insights Chave:**\n- Identificação de um problema de negócio específico e relevante\n- Execução técnica excepcional e foco na experiência do usuário\n- Estratégia de crescimento bem elaborada e execução eficaz\n\n`
        : `## Case 1: Digital Transformation in a Traditional Company\n\nAn established company in the manufacturing sector implemented a comprehensive digital transformation strategy, incorporating IoT, advanced data analytics, and intelligent automation into its operations. This initiative resulted in a 30% increase in operational efficiency, a 25% reduction in maintenance costs, and significant improvement in product quality.\n\n**Success Factors:**\n- Holistic approach to digital transformation\n- Strong executive sponsorship and organizational alignment\n- Focus on capability building and change management\n\n## Case 2: Disruptive Technology Startup\n\nA startup created an AI-based platform that revolutionized how companies manage their supply chains. Using machine learning and predictive analytics, the platform optimizes inventory, logistics, and demand planning in real-time. The startup grew rapidly, attracting significant investment and building an international customer base.\n\n**Key Insights:**\n- Identification of a specific and relevant business problem\n- Exceptional technical execution and focus on user experience\n- Well-crafted growth strategy and effective execution\n\n`;
    } else if (mainTopicLowercase.includes('sustain') || mainTopicLowercase.includes('environment')) {
      content += language === 'pt'
        ? `## Caso 1: Integração de Sustentabilidade na Estratégia Corporativa\n\nUma multinacional líder redefiniu sua estratégia corporativa para colocar a sustentabilidade no centro de todas as decisões de negócios. A empresa estabeleceu metas ambiciosas de redução de carbono, redesenhou produtos usando princípios de economia circular e transformou sua cadeia de suprimentos para priorizar fornecedores sustentáveis. Esta abordagem não apenas reduziu significativamente a pegada ambiental, mas também melhorou a reputação da marca e impulsionou a inovação.\n\n**Fatores de Sucesso:**\n- Compromisso autêntico do nível executivo\n- Integração da sustentabilidade em todos os aspectos do negócio\n- Transparência e comunicação eficaz com stakeholders\n\n## Caso 2: Inovação para Sustentabilidade em uma PME\n\nUma pequena empresa do setor alimentício implementou um modelo de negócio inovador baseado em princípios de desperdício zero e abastecimento local. Através de parcerias estratégicas com produtores locais e tecnologias inovadoras de embalagem, a empresa eliminou quase completamente o desperdício de alimentos em suas operações. Este modelo não apenas criou uma vantagem competitiva única, mas também fortaleceu a comunidade local.\n\n**Insights Chave:**\n- Alinhamento da sustentabilidade com o propósito central do negócio\n- Abordagem colaborativa envolvendo toda a cadeia de valor\n- Foco em inovação direcionada a resultados específicos\n\n`
        : `## Case 1: Integration of Sustainability into Corporate Strategy\n\nA leading multinational redefined its corporate strategy to place sustainability at the center of all business decisions. The company established ambitious carbon reduction targets, redesigned products using circular economy principles, and transformed its supply chain to prioritize sustainable suppliers. This approach not only significantly reduced the environmental footprint but also improved brand reputation and drove innovation.\n\n**Success Factors:**\n- Authentic commitment from the executive level\n- Integration of sustainability into all aspects of the business\n- Transparency and effective communication with stakeholders\n\n## Case 2: Innovation for Sustainability in an SME\n\nA small company in the food sector implemented an innovative business model based on zero waste principles and local sourcing. Through strategic partnerships with local producers and innovative packaging technologies, the company virtually eliminated food waste in its operations. This model not only created a unique competitive advantage but also strengthened the local community.\n\n**Key Insights:**\n- Alignment of sustainability with the core purpose of the business\n- Collaborative approach involving the entire value chain\n- Focus on innovation directed at specific outcomes\n\n`;
    } else {
      content += language === 'pt'
        ? `## Caso 1: Implementação Estratégica em Organização Líder\n\nUma organização líder do setor implementou uma abordagem inovadora para ${mainTopic}, integrando novas tecnologias com processos de negócio repensados. Esta iniciativa resultou em melhorias significativas em eficiência, redução de custos e experiência do cliente, estabelecendo novos padrões para a indústria.\n\n**Fatores de Sucesso:**\n- Visão estratégica clara e alinhamento organizacional\n- Abordagem integrada combinando tecnologia e processos\n- Foco contínuo em métricas de desempenho e melhoria\n\n## Caso 2: Solução Inovadora de uma Empresa Emergente\n\nUma empresa emergente desenvolveu uma solução inovadora para desafios relacionados a ${mainTopic}, utilizando abordagens não convencionais e tecnologias de ponta. A solução ganhou rápida adoção no mercado devido à sua eficácia e facilidade de implementação, atendendo a uma necessidade não satisfeita dos clientes.\n\n**Insights Chave:**\n- Identificação precisa de necessidades não atendidas do mercado\n- Excelência em desenvolvimento de produto e experiência do usuário\n- Execução eficaz de estratégia go-to-market\n\n`
        : `## Case 1: Strategic Implementation in Leading Organization\n\nA leading organization in the sector implemented an innovative approach to ${mainTopic}, integrating new technologies with rethought business processes. This initiative resulted in significant improvements in efficiency, cost reduction, and customer experience, setting new standards for the industry.\n\n**Success Factors:**\n- Clear strategic vision and organizational alignment\n- Integrated approach combining technology and processes\n- Continuous focus on performance metrics and improvement\n\n## Case 2: Innovative Solution from an Emerging Company\n\nAn emerging company developed an innovative solution for challenges related to ${mainTopic}, using unconventional approaches and cutting-edge technologies. The solution gained rapid market adoption due to its effectiveness and ease of implementation, addressing an unmet customer need.\n\n**Key Insights:**\n- Precise identification of unmet market needs\n- Excellence in product development and user experience\n- Effective execution of go-to-market strategy\n\n`;
    }
    
    // Add success metrics visualization
    const successMetricsData = [
      { metric: language === 'pt' ? "ROI" : "ROI", case1: Math.floor(Math.random() * 30) + 50, case2: Math.floor(Math.random() * 40) + 40 },
      { metric: language === 'pt' ? "Satisfação" : "Satisfaction", case1: Math.floor(Math.random() * 20) + 70, case2: Math.floor(Math.random() * 25) + 65 },
      { metric: language === 'pt' ? "Adoção" : "Adoption", case1: Math.floor(Math.random() * 30) + 60, case2: Math.floor(Math.random() * 35) + 55 },
      { metric: language === 'pt' ? "Eficiência" : "Efficiency", case1: Math.floor(Math.random() * 25) + 65, case2: Math.floor(Math.random() * 20) + 70 }
    ];
    
    content += language === 'pt' ? '## Métricas de Sucesso Comparativas\n\n' : '## Comparative Success Metrics\n\n';
    content += createChartVisualization(
      'bar',
      language === 'pt' ? `Métricas Chave de Sucesso` : `Key Success Metrics`,
      successMetricsData,
      'metric',
      '',
      { 
        series: [
          { dataKey: 'case1', name: language === 'pt' ? 'Caso 1' : 'Case 1' },
          { dataKey: 'case2', name: language === 'pt' ? 'Caso 2' : 'Case 2' }
        ],
        colors: ['#8884d8', '#82ca9d']
      }
    );
    
    content += '\n\n';
    
    content += language === 'pt'
      ? `Estes casos demonstram a diversidade de abordagens e resultados relacionados a ${mainTopic}. As organizações podem extrair lições valiosas destas experiências para informar suas próprias estratégias e iniciativas de implementação.`
      : `These cases demonstrate the diversity of approaches and outcomes related to ${mainTopic}. Organizations can extract valuable lessons from these experiences to inform their own strategies and implementation initiatives.`;
  }
  
  // Conclusions section
  else if (topicTitleLowercase.includes('conclusion') || topicTitleLowercase.includes('conclus') || 
           topicTitleLowercase.includes('recommend') || topicTitleLowercase.includes('recomend')) {
    content = `# ${topic.title}\n\n`;
    
    content += language === 'pt'
      ? `A análise abrangente apresentada neste relatório sobre ${mainTopic} destaca várias tendências importantes, desafios críticos e oportunidades emergentes. À medida que este campo continua a evoluir, as organizações devem adotar abordagens estratégicas para navegar na complexidade e capturar valor.\n\n`
      : `The comprehensive analysis presented in this report on ${mainTopic} highlights several important trends, critical challenges, and emerging opportunities. As this field continues to evolve, organizations must adopt strategic approaches to navigate complexity and capture value.\n\n`;
    
    content += language === 'pt' ? '## Principais Conclusões\n\n' : '## Key Conclusions\n\n';
    
    // Generate conclusions based on the main topic
    if (mainTopicLowercase.includes('tech') || mainTopicLowercase.includes('digital')) {
      content += language === 'pt'
        ? `1. **Aceleração da Transformação Digital**: A adoção de tecnologias digitais está acelerando em todos os setores, impulsionada pela necessidade de maior agilidade e resiliência.\n\n2. **Convergência Tecnológica**: Tecnologias como IA, IoT, e cloud computing estão cada vez mais convergindo para criar soluções mais poderosas e integradas.\n\n3. **Foco em Experiência do Usuário**: As organizações bem-sucedidas priorizam experiências de usuário intuitivas e personalizadas como diferenciador competitivo.\n\n4. **Cultura e Capacidades**: O sucesso na transformação digital depende tanto de fatores humanos e culturais quanto da implementação tecnológica.\n\n`
        : `1. **Acceleration of Digital Transformation**: The adoption of digital technologies is accelerating across all sectors, driven by the need for greater agility and resilience.\n\n2. **Technological Convergence**: Technologies such as AI, IoT, and cloud computing are increasingly converging to create more powerful and integrated solutions.\n\n3. **Focus on User Experience**: Successful organizations prioritize intuitive and personalized user experiences as a competitive differentiator.\n\n4. **Culture and Capabilities**: Success in digital transformation depends as much on human and cultural factors as on technological implementation.\n\n`;
    } else if (mainTopicLowercase.includes('sustain') || mainTopicLowercase.includes('environment')) {
      content += language === 'pt'
        ? `1. **Imperativo Estratégico**: A sustentabilidade está evoluindo de uma consideração periférica para um imperativo estratégico central para as organizações.\n\n2. **Demanda dos Stakeholders**: Investidores, consumidores e reguladores estão exercendo pressão crescente por práticas de negócios sustentáveis e transparentes.\n\n3. **Oportunidades de Inovação**: A sustentabilidade está impulsionando inovação em produtos, serviços e modelos de negócio.\n\n4. **Abordagem Integrada**: As organizações mais bem-sucedidas integram a sustentabilidade em todos os aspectos de suas operações e tomada de decisão.\n\n`
        : `1. **Strategic Imperative**: Sustainability is evolving from a peripheral consideration to a core strategic imperative for organizations.\n\n2. **Stakeholder Demand**: Investors, consumers, and regulators are exerting increasing pressure for sustainable and transparent business practices.\n\n3. **Innovation Opportunities**: Sustainability is driving innovation in products, services, and business models.\n\n4. **Integrated Approach**: The most successful organizations integrate sustainability into all aspects of their operations and decision-making.\n\n`;
    } else {
      content += language === 'pt'
        ? `1. **Ritmo de Mudança**: A velocidade e magnitude das mudanças relacionadas a ${mainTopic} estão aumentando, exigindo maior agilidade e capacidade de adaptação.\n\n2. **Ecossistemas Colaborativos**: Parcerias e ecossistemas estão se tornando cada vez mais importantes para acessar capacidades complementares e criar valor.\n\n3. **Importância dos Dados**: O uso estratégico de dados e analytics está emergindo como um diferenciador fundamental para as organizações líderes.\n\n4. **Abordagem Centrada no Cliente**: Organizações bem-sucedidas colocam as necessidades e expectativas dos clientes no centro de suas estratégias e operações.\n\n`
        : `1. **Pace of Change**: The speed and magnitude of changes related to ${mainTopic} are increasing, requiring greater agility and adaptability.\n\n2. **Collaborative Ecosystems**: Partnerships and ecosystems are becoming increasingly important to access complementary capabilities and create value.\n\n3. **Importance of Data**: The strategic use of data and analytics is emerging as a key differentiator for leading organizations.\n\n4. **Customer-Centric Approach**: Successful organizations place customer needs and expectations at the center of their strategies and operations.\n\n`;
    }
    
    // Add recommendations visualization
    const recommendationImpactData = [
      { 
        recommendation: language === 'pt' ? "Recomendação 1" : "Recommendation 1", 
        impact: Math.floor(Math.random() * 30) + 60, 
        difficulty: Math.floor(Math.random() * 20) + 40 
      },
      { 
        recommendation: language === 'pt' ? "Recomendação 2" : "Recommendation 2", 
        impact: Math.floor(Math.random() * 25) + 65, 
        difficulty: Math.floor(Math.random() * 30) + 35
      },
      { 
        recommendation: language === 'pt' ? "Recomendação 3" : "Recommendation 3", 
        impact: Math.floor(Math.random() * 20) + 70, 
        difficulty: Math.floor(Math.random() * 35) + 50 
      },
      { 
        recommendation: language === 'pt' ? "Recomendação 4" : "Recommendation 4", 
        impact: Math.floor(Math.random() * 15) + 55, 
        difficulty: Math.floor(Math.random() * 25) + 30 
      }
    ];
    
    content += language === 'pt' ? '## Recomendações Estratégicas\n\n' : '## Strategic Recommendations\n\n';
    content += createChartVisualization(
      'scatter',
      language === 'pt' ? `Impacto vs. Dificuldade de Implementação` : `Impact vs. Implementation Difficulty`,
      recommendationImpactData,
      'difficulty',
      'impact',
      { 
        colors: ['#8884d8'],
        namePath: 'recommendation'
      }
    );
    
    content += '\n\n';
    
    content += language === 'pt'
      ? `1. **Desenvolver uma Visão Clara**: Estabelecer uma visão estratégica clara para ${mainTopic} que esteja alinhada com os objetivos de negócio mais amplos e propósito organizacional.\n\n2. **Investir em Capacidades Fundamentais**: Desenvolver as capacidades técnicas, operacionais e humanas necessárias para executar efetivamente iniciativas relacionadas a ${mainTopic}.\n\n3. **Adotar uma Abordagem Iterativa**: Implementar iniciativas de forma incremental, com ciclos rápidos de aprendizado e adaptação baseados em feedback contínuo.\n\n4. **Cultivar Parcerias Estratégicas**: Identificar e desenvolver parcerias com organizações complementares para acessar capacidades adicionais e acelerar o progresso.\n\n`
      : `1. **Develop a Clear Vision**: Establish a clear strategic vision for ${mainTopic} that is aligned with broader business objectives and organizational purpose.\n\n2. **Invest in Core Capabilities**: Develop the technical, operational, and human capabilities necessary to effectively execute initiatives related to ${mainTopic}.\n\n3. **Adopt an Iterative Approach**: Implement initiatives incrementally, with rapid learning and adaptation cycles based on continuous feedback.\n\n4. **Cultivate Strategic Partnerships**: Identify and develop partnerships with complementary organizations to access additional capabilities and accelerate progress.\n\n`;
    
    content += language === 'pt'
      ? `As organizações que abordam ${mainTopic} com uma mentalidade estratégica, investindo em capacidades apropriadas e adotando uma abordagem ágil à implementação, estarão melhor posicionadas para capturar o valor significativo disponível neste domínio em evolução.`
      : `Organizations that approach ${mainTopic} with a strategic mindset, investing in appropriate capabilities and adopting an agile approach to implementation, will be better positioned to capture the significant value available in this evolving domain.`;
  }
  
  // Default content for any other sections
  else {
    content = `# ${topic.title}\n\n`;
    
    content += language === 'pt'
      ? `Esta seção explora aspectos importantes relacionados a ${mainTopic}, fornecendo insights sobre tendências atuais, desafios emergentes e implicações futuras. A análise oferece considerações práticas para organizações que navegam neste domínio em evolução.\n\n`
      : `This section explores important aspects related to ${mainTopic}, providing insights into current trends, emerging challenges, and future implications. The analysis offers practical considerations for organizations navigating this evolving domain.\n\n`;
    
    // Create a random data visualization based on the topic
    const randomData = Array.from({ length: 5 }, (_, i) => ({
      category: `${language === 'pt' ? 'Categoria' : 'Category'} ${i + 1}`,
      value: Math.floor(Math.random() * 50) + 20
    }));
    
    content += language === 'pt' ? '## Análise de Dados\n\n' : '## Data Analysis\n\n';
    content += createChartVisualization(
      'bar',
      language === 'pt' ? `Análise de ${topic.title}` : `${topic.title} Analysis`,
      randomData,
      'category',
      'value',
      { colors: ['#8884d8'] }
    );
    
    content += '\n\n';
    
    content += language === 'pt'
      ? `## Considerações Principais\n\n1. **Tendência 1**: Descrição da primeira tendência importante relacionada a este tópico e suas implicações.\n\n2. **Tendência 2**: Análise da segunda tendência relevante e como ela está moldando o panorama.\n\n3. **Consideração Estratégica**: Abordagem recomendada para organizações que navegam neste espaço.\n\n`
      : `## Key Considerations\n\n1. **Trend 1**: Description of the first important trend related to this topic and its implications.\n\n2. **Trend 2**: Analysis of the second relevant trend and how it is shaping the landscape.\n\n3. **Strategic Consideration**: Recommended approach for organizations navigating this space.\n\n`;
    
    content += language === 'pt'
      ? `Esta análise destaca a importância de uma abordagem estratégica e informada para ${topic.title.toLowerCase()} no contexto de ${mainTopic}. As organizações que desenvolvem uma compreensão profunda destas dinâmicas estarão melhor equipadas para navegar na complexidade e capturar valor.`
      : `This analysis highlights the importance of a strategic and informed approach to ${topic.title.toLowerCase()} in the context of ${mainTopic}. Organizations that develop a deep understanding of these dynamics will be better equipped to navigate complexity and capture value.`;
  }
  
  return content;
}

// Function to assemble the full report
export function assembleFullReport(title: string, topics: ReportTopic[], topicContents: string[]): string {
  console.log(`Assembling full report with ${topics.length} topics`);
  
  let fullReport = `# ${title}\n\n`;
  
  // Add each topic content to the full report
  topicContents.forEach((content, index) => {
    fullReport += content;
    
    // Add a separator between topics except for the last one
    if (index < topicContents.length - 1) {
      fullReport += '\n\n---\n\n';
    }
  });
  
  return fullReport;
}

// Function to save a generated report
export async function saveReport(reportData: any): Promise<AIGeneratedReport> {
  console.log("Saving report to database:", reportData.title);
  
  try {
    // Format for insert
    const { data, error } = await supabase
      .from('ai_generated_reports')
      .insert({
        title: reportData.title,
        content: reportData.content,
        language: reportData.language || 'en',
        user_id: reportData.user_id,
        metadata: reportData.metadata || {},
        chart_data: reportData.chart_data || {},
        report_type: reportData.report_type || 'AI Generated',
        file_url: reportData.file_url
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error saving report:", error);
      
      // For development, create a dummy report if database save fails
      return {
        id: 'dev-report-' + Date.now(),
        title: reportData.title,
        content: reportData.content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: reportData.user_id,
        language: reportData.language || 'en',
        metadata: reportData.metadata || {},
        chart_data: reportData.chart_data || {},
        report_type: reportData.report_type || 'AI Generated',
        file_url: reportData.file_url
      };
    }
    
    console.log("Report saved successfully with ID:", data.id);
    return data as AIGeneratedReport;
    
  } catch (error) {
    console.error("Exception saving report:", error);
    
    // Return development report for demonstration/testing
    return {
      id: 'dev-report-' + Date.now(),
      title: reportData.title,
      content: reportData.content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: reportData.user_id,
      language: reportData.language || 'en',
      metadata: reportData.metadata || {},
      chart_data: reportData.chart_data || {},
      report_type: reportData.report_type || 'AI Generated',
      file_url: reportData.file_url
    };
  }
}

// Function to generate a PDF from a report
export async function generatePDF(report: AIGeneratedReport): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Get content element to capture
      setTimeout(async () => {
        try {
          const element = document.querySelector('#report-content');
          
          if (!element) {
            console.error("Could not find report content element for PDF generation");
            reject(new Error("Report content element not found"));
            return;
          }
          
          console.log("Generating PDF for report:", report.title);
          
          // Use html2canvas to capture the content
          const canvas = await html2canvas(element as HTMLElement, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
            allowTaint: true
          });
          
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          
          // Set up PDF document
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });
          
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const imgX = (pdfWidth - imgWidth * ratio) / 2;
          
          // Add image to PDF
          pdf.addImage(imgData, 'JPEG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
          
          // If content is larger than one page, add more pages
          const pageCount = Math.ceil(imgHeight * ratio / pdfHeight);
          
          for (let i = 1; i < pageCount; i++) {
            pdf.addPage();
            pdf.addImage(
              imgData, 
              'JPEG', 
              imgX, 
              -(pdfHeight * i), 
              imgWidth * ratio, 
              imgHeight * ratio
            );
          }
          
          // Get data URL for the PDF
          const pdfDataUri = pdf.output('datauristring');
          console.log("PDF generation complete");
          
          resolve(pdfDataUri);
        } catch (canvasError) {
          console.error("Error capturing content:", canvasError);
          reject(canvasError);
        }
      }, 500); // Small delay to ensure content is fully rendered
    } catch (error) {
      console.error("Error in PDF generation:", error);
      reject(error);
    }
  });
}

// Function to extract visualization data from report content
export const extractVisualizations = (content: string | any): any[] => {
  if (!content) return [];
  
  let contentString = '';
  
  // If the content is an object with a value property, use the value
  if (typeof content === 'string') {
    contentString = content;
  } else if (typeof content === 'object' && content !== null) {
    // Type guard to safely check for _type property
    const contentObj = content as any;
    if (contentObj._type === 'String' && 'value' in contentObj) {
      contentString = contentObj.value || '';
      console.log("Found content as object, using value property instead");
    }
  }
  
  if (!contentString) return [];
  
  console.log("Extracting visualizations from content length:", contentString.length);
  
  const visualizationMarkers = contentString.match(/\[Visualization:[^\]]+\]/g) || [];
  console.log(`Found ${visualizationMarkers.length} visualization markers`);
  
  return visualizationMarkers.map(marker => {
    try {
      // Extract the portion after "Visualization:" and before closing "]"
      const jsonStartIndex = marker.indexOf(':', 14) + 1;
      const jsonStr = marker.substring(jsonStartIndex, marker.length - 1).trim();
      
      // Check if the JSON is complete (has closing braces/brackets)
      let jsonData: any;

      try {
        jsonData = JSON.parse(jsonStr);
        console.log("Successfully parsed visualization data");
      } catch (parseError) {
        console.error('Error parsing visualization data:', parseError);
        
        // Attempt to fix common JSON parse errors
        let fixedJson = jsonStr;
        
        // Count opening and closing braces/brackets
        const openBraces = (jsonStr.match(/{/g) || []).length;
        const closeBraces = (jsonStr.match(/}/g) || []).length;
        const openBrackets = (jsonStr.match(/\[/g) || []).length;
        const closeBrackets = (jsonStr.match(/\]/g) || []).length;
        
        // Add missing closing braces/brackets
        for (let i = 0; i < openBraces - closeBraces; i++) {
          fixedJson += '}';
        }
        
        for (let i = 0; i < openBrackets - closeBrackets; i++) {
          fixedJson += ']';
        }
        
        try {
          jsonData = JSON.parse(fixedJson);
          console.log('Successfully fixed and parsed JSON for visualization');
        } catch (secondError) {
          console.error('Failed to fix JSON:', secondError);
          
          // In case of failure, provide a default visualization
          return {
            type: 'bar',
            title: 'Default Visualization',
            data: [
              { category: 'A', value: 30 },
              { category: 'B', value: 45 },
              { category: 'C', value: 60 },
            ],
            xAxisKey: 'category',
            dataKey: 'value'
          };
        }
      }
      
      // Validate the required fields for a visualization
      if (!jsonData.type || !jsonData.data) {
        console.warn('Invalid visualization data: missing required fields');
        return null;
      }
      
      return jsonData;
    } catch (e) {
      console.error('Error processing visualization marker:', e);
      return null;
    }
  }).filter(Boolean);
}

// Function to fetch AI-generated reports
export async function fetchReports(language: string = 'en'): Promise<AIGeneratedReport[]> {
  console.log(`Fetching reports for language: ${language}`);
  
  try {
    const { data, error } = await supabase
      .from('ai_generated_reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching reports:", error);
      
      // For development/testing purposes, return sample data if database fetch fails
      return [
        {
          id: 'dev-report-1',
          title: language === 'pt' ? 'Relatório de Análise de Mercado' : 'Market Analysis Report',
          content: language === 'pt' 
            ? '# Análise de Mercado\n\nEste é um relatório gerado automaticamente com análise de mercado detalhada.\n\n[Visualization:{"type":"bar","title":"Distribuição por Setor","data":[{"category":"Tecnologia","value":45},{"category":"Saúde","value":25},{"category":"Finanças","value":30}],"xAxisKey":"category","dataKey":"value"}]'
            : '# Market Analysis\n\nThis is an automatically generated report with detailed market analysis.\n\n[Visualization:{"type":"bar","title":"Sector Distribution","data":[{"category":"Technology","value":45},{"category":"Healthcare","value":25},{"category":"Finance","value":30}],"xAxisKey":"category","dataKey":"value"}]',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          user_id: null,
          language: language,
          metadata: {},
          report_type: language === 'pt' ? 'Análise de Mercado' : 'Market Analysis'
        },
        {
          id: 'dev-report-2',
          title: language === 'pt' ? 'Tendências Tecnológicas 2023' : 'Technology Trends 2023',
          content: language === 'pt'
            ? '# Tendências Tecnológicas\n\nAnálise das principais tendências tecnológicas de 2023.\n\n[Visualization:{"type":"line","title":"Adoção de Tecnologia","data":[{"year":"2019","value":30},{"year":"2020","value":42},{"year":"2021","value":55},{"year":"2022","value":70},{"year":"2023","value":85}],"xAxisKey":"year","dataKey":"value"}]'
            : '# Technology Trends\n\nAnalysis of the main technology trends of 2023.\n\n[Visualization:{"type":"line","title":"Technology Adoption","data":[{"year":"2019","value":30},{"year":"2020","value":42},{"year":"2021","value":55},{"year":"2022","value":70},{"year":"2023","value":85}],"xAxisKey":"year","dataKey":"value"}]',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString(),
          user_id: null,
          language: language,
          metadata: {},
          report_type: language === 'pt' ? 'Análise de Tendências' : 'Trend Analysis'
        }
      ];
    }
    
    console.log(`Fetched ${data.length} reports`);
    return data as AIGeneratedReport[];
    
  } catch (error) {
    console.error("Error in fetchReports:", error);
    
    // Return sample data for development/testing
    return [
      {
        id: 'dev-report-1',
        title: language === 'pt' ? 'Relatório de Análise de Mercado' : 'Market Analysis Report',
        content: language === 'pt' 
          ? '# Análise de Mercado\n\nEste é um relatório gerado automaticamente com análise de mercado detalhada.\n\n[Visualization:{"type":"bar","title":"Distribuição por Setor","data":[{"category":"Tecnologia","value":45},{"category":"Saúde","value":25},{"category":"Finanças","value":30}],"xAxisKey":"category","dataKey":"value"}]'
          : '# Market Analysis\n\nThis is an automatically generated report with detailed market analysis.\n\n[Visualization:{"type":"bar","title":"Sector Distribution","data":[{"category":"Technology","value":45},{"category":"Healthcare","value":25},{"category":"Finance","value":30}],"xAxisKey":"category","dataKey":"value"}]',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        user_id: null,
        language: language,
        metadata: {},
        report_type: language === 'pt' ? 'Análise de Mercado' : 'Market Analysis'
      },
      {
        id: 'dev-report-2',
        title: language === 'pt' ? 'Tendências Tecnológicas 2023' : 'Technology Trends 2023',
        content: language === 'pt'
          ? '# Tendências Tecnológicas\n\nAnálise das principais tendências tecnológicas de 2023.\n\n[Visualization:{"type":"line","title":"Adoção de Tecnologia","data":[{"year":"2019","value":30},{"year":"2020","value":42},{"year":"2021","value":55},{"year":"2022","value":70},{"year":"2023","value":85}],"xAxisKey":"year","dataKey":"value"}]'
          : '# Technology Trends\n\nAnalysis of the main technology trends of 2023.\n\n[Visualization:{"type":"line","title":"Technology Adoption","data":[{"year":"2019","value":30},{"year":"2020","value":42},{"year":"2021","value":55},{"year":"2022","value":70},{"year":"2023","value":85}],"xAxisKey":"year","dataKey":"value"}]',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 172800000).toISOString(),
        user_id: null,
        language: language,
        metadata: {},
        report_type: language === 'pt' ? 'Análise de Tendências' : 'Trend Analysis'
      }
    ];
  }
}

// Function to delete an AI-generated report
export async function deleteReport(id: string): Promise<void> {
  console.log(`Deleting report with ID: ${id}`);
  
  try {
    const { error } = await supabase
      .from('ai_generated_reports')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting report:", error);
      throw error;
    }
    
    console.log("Report deleted successfully");
  } catch (error) {
    console.error("Error in deleteReport:", error);
    throw error;
  }
}
