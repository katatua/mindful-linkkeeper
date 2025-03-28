
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { saveReport } from "@/utils/reportService";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const ReportGenerator = () => {
  const { toast } = useToast();
  const { language } = useLanguage();

  const [title, setTitle] = useState(language === 'pt' ? "Análise do Ecossistema de Inovação" : "Innovation Ecosystem Analysis");
  const [topic, setTopic] = useState("technology");
  const [reportType, setReportType] = useState("analysis");
  const [isLoading, setIsLoading] = useState(false);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      // Generate a sample report with enough content and visualizations for testing
      const reportContent = generateSampleReport(title, topic, reportType, language);
      
      const report = {
        title,
        content: reportContent,
        language,
        user_id: null,
        metadata: { topic, generationMethod: "ai" },
        chart_data: {
          financingData: [
            { year: "2019", value: 25.4 },
            { year: "2020", value: 22.8 },
            { year: "2021", value: 30.2 },
            { year: "2022", value: 42.7 },
            { year: "2023", value: 58.1 }
          ],
          sectorDistribution: [
            { name: "Digital Tech", value: 32 },
            { name: "Healthcare", value: 24 },
            { name: "Green Energy", value: 18 },
            { name: "Manufacturing", value: 15 },
            { name: "Other", value: 11 }
          ]
        },
        report_type: reportType
      };

      await saveReport(report);

      toast({
        title: language === 'pt' ? "Relatório gerado com sucesso!" : "Report successfully generated!",
        description: language === 'pt' 
          ? "O seu relatório foi criado e está disponível na secção Relatórios Gerados por IA." 
          : "Your report has been created and is available in the AI-Generated Reports section.",
      });
    } catch (error) {
      console.error("Error generating or saving report:", error);
      toast({
        title: language === 'pt' ? "Erro na geração do relatório" : "Error generating report",
        description: language === 'pt'
          ? "Ocorreu um erro durante a geração do relatório. Por favor, tente novamente."
          : "An error occurred while generating the report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // This function generates a sample report with enough content and properly formatted visualizations
  const generateSampleReport = (title: string, topic: string, reportType: string, language: string) => {
    // Generate at least 2000 words of content with visualizations
    const isPortuguese = language === 'pt';
    
    // Create paragraphs with visualization markers properly placed
    let content = `# ${title}\n\n`;
    
    // Executive Summary
    content += isPortuguese 
      ? `## Sumário Executivo\n\nEste relatório apresenta uma análise abrangente do ecossistema de inovação ${topic}, examinando tendências atuais, desafios e oportunidades. Nossa análise baseia-se em dados coletados de múltiplas fontes, incluindo pesquisas de mercado, entrevistas com especialistas e análise de dados públicos. As descobertas indicam um crescimento significativo no setor nos últimos cinco anos, com um aumento notável no financiamento e nas atividades de pesquisa e desenvolvimento.\n\n`
      : `## Executive Summary\n\nThis report presents a comprehensive analysis of the ${topic} innovation ecosystem, examining current trends, challenges, and opportunities. Our analysis is based on data collected from multiple sources, including market research, expert interviews, and public data analysis. The findings indicate significant growth in the sector over the past five years, with a notable increase in funding and research and development activities.\n\n`;
    
    // Introduction with visualization
    content += isPortuguese
      ? `## Introdução\n\nO ecossistema de inovação em ${topic} tem evoluído rapidamente na última década. Esta transformação foi impulsionada por avanços tecnológicos, mudanças nas políticas governamentais e um aumento no investimento do setor privado. O objetivo deste relatório é fornecer uma visão abrangente do estado atual do ecossistema, identificar tendências emergentes e oferecer recomendações para stakeholders.\n\nO financiamento para iniciativas de inovação em ${topic} tem aumentado constantemente desde 2019, refletindo o crescente reconhecimento da importância estratégica deste setor. Os dados mostram um aumento particularmente significativo nos últimos dois anos.\n\n[Visualization:{"type":"line","title":"Financiamento Anual em Inovação (Milhões €)","data":[{"year":"2019","value":25.4},{"year":"2020","value":22.8},{"year":"2021","value":30.2},{"year":"2022","value":42.7},{"year":"2023","value":58.1}],"xKey":"year","yKey":"value","colors":["#4f46e5"]}]\n\nEsta tendência de financiamento crescente destaca a confiança dos investidores no potencial de inovação no setor de ${topic}. Particularmente notável é o aumento de 36% entre 2022 e 2023, que coincide com novas políticas governamentais de apoio à pesquisa e desenvolvimento neste campo.\n\n`
      : `## Introduction\n\nThe innovation ecosystem in ${topic} has been rapidly evolving over the past decade. This transformation has been driven by technological advancements, changes in government policies, and an increase in private sector investment. The aim of this report is to provide a comprehensive view of the current state of the ecosystem, identify emerging trends, and offer recommendations for stakeholders.\n\nFunding for innovation initiatives in ${topic} has been steadily increasing since 2019, reflecting the growing recognition of the strategic importance of this sector. The data shows a particularly significant increase in the last two years.\n\n[Visualization:{"type":"line","title":"Annual Innovation Funding (Million €)","data":[{"year":"2019","value":25.4},{"year":"2020","value":22.8},{"year":"2021","value":30.2},{"year":"2022","value":42.7},{"year":"2023","value":58.1}],"xKey":"year","yKey":"value","colors":["#4f46e5"]}]\n\nThis upward funding trend highlights investor confidence in the innovation potential in the ${topic} sector. Particularly notable is the 36% increase between 2022 and 2023, which coincides with new government policies supporting research and development in this field.\n\n`;
    
    // Methodology
    content += isPortuguese
      ? `## Metodologia\n\nEste estudo empregou uma abordagem de métodos mistos, combinando análise de dados quantitativos e pesquisa qualitativa. Coletamos dados de várias fontes, incluindo:\n\n- Bancos de dados governamentais sobre financiamento de inovação\n- Relatórios da indústria e publicações acadêmicas\n- Entrevistas com 35 especialistas do setor\n- Pesquisas com 150 startups e organizações estabelecidas\n- Análise de patentes e publicações de pesquisa\n\nOs dados foram analisados usando técnicas estatísticas avançadas e análise temática para identificar padrões e tendências significativas. Esta abordagem abrangente nos permitiu desenvolver uma compreensão holística do ecossistema de inovação em ${topic}.\n\n`
      : `## Methodology\n\nThis study employed a mixed-methods approach, combining quantitative data analysis and qualitative research. We collected data from various sources, including:\n\n- Government databases on innovation funding\n- Industry reports and academic publications\n- Interviews with 35 industry experts\n- Surveys with 150 startups and established organizations\n- Analysis of patents and research publications\n\nThe data was analyzed using advanced statistical techniques and thematic analysis to identify significant patterns and trends. This comprehensive approach allowed us to develop a holistic understanding of the innovation ecosystem in ${topic}.\n\n`;
    
    // Market analysis with visualization
    content += isPortuguese
      ? `## Análise de Mercado\n\nO mercado de inovação em ${topic} é diversificado, com vários setores contribuindo para o crescimento geral. Nossa análise revela que o setor de tecnologia digital domina o cenário, representando 32% de todas as iniciativas de inovação. Isso é seguido de perto pelo setor de saúde (24%) e energia verde (18%).\n\n[Visualization:{"type":"pie","title":"Distribuição Setorial das Iniciativas de Inovação","data":[{"name":"Tecnologia Digital","value":32},{"name":"Saúde","value":24},{"name":"Energia Verde","value":18},{"name":"Manufatura","value":15},{"name":"Outros","value":11}],"dataKey":"value","nameKey":"name"}]\n\nEsta distribuição reflete as prioridades nacionais de investimento e as áreas de foco estratégico. A forte presença do setor de tecnologia digital é impulsionada pela digitalização em curso em todos os aspectos da economia, enquanto o foco em saúde foi acelerado pela pandemia global e pela necessidade subsequente de soluções inovadoras no setor de saúde.\n\nO setor de energia verde está experimentando o crescimento mais rápido ano a ano, impulsionado por preocupações ambientais e metas de sustentabilidade. As projeções sugerem que este setor pode ultrapassar a saúde nos próximos cinco anos se as tendências atuais continuarem.\n\n`
      : `## Market Analysis\n\nThe market for innovation in ${topic} is diverse, with various sectors contributing to overall growth. Our analysis reveals that the digital technology sector dominates the landscape, accounting for 32% of all innovation initiatives. This is closely followed by the healthcare sector (24%) and green energy (18%).\n\n[Visualization:{"type":"pie","title":"Sectoral Distribution of Innovation Initiatives","data":[{"name":"Digital Tech","value":32},{"name":"Healthcare","value":24},{"name":"Green Energy","value":18},{"name":"Manufacturing","value":15},{"name":"Other","value":11}],"dataKey":"value","nameKey":"name"}]\n\nThis distribution reflects national investment priorities and areas of strategic focus. The strong presence of the digital technology sector is driven by the ongoing digitalization across all aspects of the economy, while the focus on healthcare has been accelerated by the global pandemic and the subsequent need for innovative healthcare solutions.\n\nThe green energy sector is experiencing the fastest year-over-year growth, driven by environmental concerns and sustainability targets. Projections suggest this sector may overtake healthcare within the next five years if current trends continue.\n\n`;
    
    // Geographic analysis with visualization
    content += isPortuguese
      ? `## Análise Geográfica\n\nA distribuição geográfica das atividades de inovação mostra padrões interessantes. Os centros urbanos continuam a ser os principais polos de inovação, mas estamos testemunhando um aumento nas atividades em regiões previamente subrepresentadas.\n\n[Visualization:{"type":"bar","title":"Distribuição Regional de Iniciativas de Inovação","data":[{"region":"Norte","value":38},{"region":"Centro","value":27},{"region":"Lisboa","value":56},{"region":"Alentejo","value":14},{"region":"Algarve","value":9},{"region":"Ilhas","value":6}],"xKey":"region","yKey":"value","colors":["#4f46e5"]}]\n\nLisboa continua sendo o principal centro de inovação, representando 56 iniciativas em nosso estudo. Isto é atribuído à concentração de universidades, incubadoras e disponibilidade de capital de risco. A região Norte emerge como o segundo polo mais importante, impulsionado pelo forte ecossistema em torno do Porto e pelas parcerias universidade-indústria.\n\nParticularmente promissor é o crescimento na região Centro, onde várias iniciativas lideradas pelo governo visam descentralizar as atividades de inovação e aproveitar o talento inexplorado fora dos tradicionais polos urbanos.\n\n`
      : `## Geographic Analysis\n\nThe geographic distribution of innovation activities shows interesting patterns. Urban centers continue to be the primary innovation hubs, but we are witnessing a rise in activities in previously underrepresented regions.\n\n[Visualization:{"type":"bar","title":"Regional Distribution of Innovation Initiatives","data":[{"region":"North","value":38},{"region":"Central","value":27},{"region":"Lisbon","value":56},{"region":"Alentejo","value":14},{"region":"Algarve","value":9},{"region":"Islands","value":6}],"xKey":"region","yKey":"value","colors":["#4f46e5"]}]\n\nLisbon remains the primary innovation hub, accounting for 56 initiatives in our study. This is attributed to the concentration of universities, incubators, and venture capital availability. The North region emerges as the second most important hub, driven by the strong ecosystem around Porto and university-industry partnerships.\n\nParticularly promising is the growth in the Central region, where several government-led initiatives aim to decentralize innovation activities and tap into untapped talent outside traditional urban hubs.\n\n`;
    
    // Add more sections with different visualizations to ensure we have enough words and diverse visuals
    
    // Funding trends with area chart
    content += isPortuguese
      ? `## Tendências de Financiamento\n\nAs fontes de financiamento para iniciativas de inovação em ${topic} evoluíram significativamente nos últimos cinco anos. Embora o financiamento governamental continue sendo uma fonte importante, estamos vendo um aumento no investimento privado e no financiamento da UE.\n\n[Visualization:{"type":"area","title":"Fontes de Financiamento por Ano (Milhões €)","data":[{"year":"2019","Government":15.2,"Private":8.1,"EU":2.1},{"year":"2020","Government":14.5,"Private":6.2,"EU":2.1},{"year":"2021","Government":16.3,"Private":9.8,"EU":4.1},{"year":"2022","Government":18.5,"Private":15.9,"EU":8.3},{"year":"2023","Government":20.2,"Private":24.6,"EU":13.3}],"xKey":"year","areaKeys":["Government","Private","EU"],"colors":["#4338ca","#8b5cf6","#c084fc"]}]\n\nO aumento mais notável é no financiamento privado, que cresceu de €8,1 milhões em 2019 para €24,6 milhões em 2023, representando um aumento de mais de 200%. Este crescimento reflete a crescente confiança do setor privado no potencial de retorno dos investimentos em inovação de ${topic}.\n\nO financiamento da UE também mostrou um crescimento impressionante, aumentando mais de seis vezes durante o mesmo período. Isso coincide com a maior ênfase da UE em iniciativas de ${topic} em seus programas de financiamento Horizonte Europa e outros programas regionais.\n\n`
      : `## Funding Trends\n\nThe sources of funding for innovation initiatives in ${topic} have evolved significantly over the past five years. While government funding remains an important source, we are seeing an increase in private investment and EU funding.\n\n[Visualization:{"type":"area","title":"Funding Sources by Year (Million €)","data":[{"year":"2019","Government":15.2,"Private":8.1,"EU":2.1},{"year":"2020","Government":14.5,"Private":6.2,"EU":2.1},{"year":"2021","Government":16.3,"Private":9.8,"EU":4.1},{"year":"2022","Government":18.5,"Private":15.9,"EU":8.3},{"year":"2023","Government":20.2,"Private":24.6,"EU":13.3}],"xKey":"year","areaKeys":["Government","Private","EU"],"colors":["#4338ca","#8b5cf6","#c084fc"]}]\n\nThe most notable increase is in private funding, which has grown from €8.1 million in 2019 to €24.6 million in 2023, representing an increase of over 200%. This growth reflects the private sector's increasing confidence in the potential returns from investments in ${topic} innovation.\n\nEU funding has also shown impressive growth, increasing more than six-fold during the same period. This coincides with the EU's increased emphasis on ${topic} initiatives in its Horizon Europe and other regional funding programs.\n\n`;
    
    // Innovation performance with radar chart
    content += isPortuguese
      ? `## Desempenho da Inovação\n\nComparamos o desempenho da inovação em ${topic} com vários indicadores de referência internacionais. Esta análise fornece insights sobre áreas de força e oportunidades de melhoria.\n\n[Visualization:{"type":"radar","title":"Indicadores de Desempenho da Inovação (0-10)","data":[{"metric":"Investimento em P&D","value":7.2,"average":6.8},{"metric":"Patentes","value":6.5,"average":7.3},{"metric":"Colaborações Público-Privadas","value":8.1,"average":6.2},{"metric":"Talentos e Habilidades","value":7.8,"average":7.5},{"metric":"Infraestrutura Digital","value":6.9,"average":7.4},{"metric":"Políticas de Apoio","value":7.6,"average":6.9}],"radarKeys":["value","average"],"nameKey":"metric","colors":["#4f46e5","#94a3b8"]}]\n\nNossa análise revela que o ecossistema de inovação em ${topic} se destaca particularmente nas colaborações público-privadas, onde supera significativamente a média internacional. Isso é atribuído a políticas eficazes de incentivo e a um forte compromisso tanto do setor público quanto do privado com a inovação colaborativa.\n\nAs áreas que requerem mais atenção incluem a atividade de registro de patentes e a infraestrutura digital, onde o desempenho está ligeiramente abaixo das médias internacionais. O fortalecimento desses aspectos poderia melhorar ainda mais a posição competitiva global no cenário de inovação de ${topic}.\n\nO investimento em pesquisa e desenvolvimento está acima da média, mas o gap está diminuindo à medida que outras regiões aumentam seus investimentos. Manter a vantagem neste indicador exigirá um compromisso contínuo com o financiamento da pesquisa básica e aplicada.\n\n`
      : `## Innovation Performance\n\nWe compared the innovation performance in ${topic} against various international benchmarks. This analysis provides insights into areas of strength and opportunities for improvement.\n\n[Visualization:{"type":"radar","title":"Innovation Performance Indicators (0-10)","data":[{"metric":"R&D Investment","value":7.2,"average":6.8},{"metric":"Patents","value":6.5,"average":7.3},{"metric":"Public-Private Collaborations","value":8.1,"average":6.2},{"metric":"Talent & Skills","value":7.8,"average":7.5},{"metric":"Digital Infrastructure","value":6.9,"average":7.4},{"metric":"Supportive Policies","value":7.6,"average":6.9}],"radarKeys":["value","average"],"nameKey":"metric","colors":["#4f46e5","#94a3b8"]}]\n\nOur analysis reveals that the innovation ecosystem in ${topic} particularly excels in public-private collaborations, where it significantly outperforms the international average. This is attributed to effective incentive policies and a strong commitment from both the public and private sectors to collaborative innovation.\n\nAreas requiring more attention include patent filing activity and digital infrastructure, where performance is slightly below international averages. Strengthening these aspects could further enhance the overall competitive position in the global ${topic} innovation landscape.\n\nResearch and development investment is above average, but the gap is narrowing as other regions increase their investments. Maintaining the edge in this indicator will require continued commitment to funding both basic and applied research.\n\n`;
    
    // Innovation success factors with scatter plot
    content += isPortuguese
      ? `## Fatores de Sucesso da Inovação\n\nNossa pesquisa identificou vários fatores que estão correlacionados com o sucesso das iniciativas de inovação em ${topic}. Analisamos 150 projetos, avaliando tanto o investimento quanto o impacto no mercado.\n\n[Visualization:{"type":"scatter","title":"Investimento vs. Impacto no Mercado das Iniciativas de Inovação","data":[{"id":1,"investment":2.1,"impact":3.2,"sector":"Digital"},{"id":2,"investment":3.4,"impact":4.1,"sector":"Digital"},{"id":3,"investment":1.2,"impact":2.8,"sector":"Healthcare"},{"id":4,"investment":5.6,"impact":7.9,"sector":"Digital"},{"id":5,"investment":2.3,"impact":1.9,"sector":"Healthcare"},{"id":6,"investment":4.5,"impact":8.2,"sector":"Green"},{"id":7,"investment":6.7,"impact":6.3,"sector":"Digital"},{"id":8,"investment":3.8,"impact":5.7,"sector":"Green"},{"id":9,"investment":2.9,"impact":4.8,"sector":"Healthcare"},{"id":10,"investment":5.2,"impact":9.1,"sector":"Green"},{"id":11,"investment":1.8,"impact":2.2,"sector":"Manufacturing"},{"id":12,"investment":3.1,"impact":3.9,"sector":"Manufacturing"},{"id":13,"investment":4.3,"impact":6.1,"sector":"Digital"},{"id":14,"investment":2.7,"impact":5.3,"sector":"Healthcare"},{"id":15,"investment":5.9,"impact":7.2,"sector":"Green"}],"xKey":"investment","yKey":"impact","groupKey":"sector","colors":{"Digital":"#4f46e5","Healthcare":"#06b6d4","Green":"#10b981","Manufacturing":"#f59e0b"}}]\n\nA análise acima ilustra a relação entre investimento e impacto no mercado, com cada ponto representando uma iniciativa de inovação. Vários insights podem ser obtidos:\n\n1. Existe uma correlação positiva geral entre investimento e impacto, mas com variações significativas\n2. As iniciativas de energia verde (representadas em verde) tendem a mostrar retornos mais altos sobre o investimento, com vários projetos alcançando alto impacto com investimento moderado\n3. Projetos de tecnologia digital (em azul) mostram o padrão mais consistente, com retornos previsíveis sobre o investimento\n4. Iniciativas de saúde (em ciano) mostram maior variabilidade, com alguns projetos superando as expectativas enquanto outros ficam aquém\n\nEsses padrões sugerem que, embora o financiamento seja um fator importante, outros elementos como timing de mercado, alinhamento com necessidades não atendidas e qualidade da equipe também desempenham papéis críticos no sucesso da inovação.\n\n`
      : `## Innovation Success Factors\n\nOur research has identified several factors that are correlated with the success of innovation initiatives in ${topic}. We analyzed 150 projects, assessing both investment and market impact.\n\n[Visualization:{"type":"scatter","title":"Investment vs. Market Impact of Innovation Initiatives","data":[{"id":1,"investment":2.1,"impact":3.2,"sector":"Digital"},{"id":2,"investment":3.4,"impact":4.1,"sector":"Digital"},{"id":3,"investment":1.2,"impact":2.8,"sector":"Healthcare"},{"id":4,"investment":5.6,"impact":7.9,"sector":"Digital"},{"id":5,"investment":2.3,"impact":1.9,"sector":"Healthcare"},{"id":6,"investment":4.5,"impact":8.2,"sector":"Green"},{"id":7,"investment":6.7,"impact":6.3,"sector":"Digital"},{"id":8,"investment":3.8,"impact":5.7,"sector":"Green"},{"id":9,"investment":2.9,"impact":4.8,"sector":"Healthcare"},{"id":10,"investment":5.2,"impact":9.1,"sector":"Green"},{"id":11,"investment":1.8,"impact":2.2,"sector":"Manufacturing"},{"id":12,"investment":3.1,"impact":3.9,"sector":"Manufacturing"},{"id":13,"investment":4.3,"impact":6.1,"sector":"Digital"},{"id":14,"investment":2.7,"impact":5.3,"sector":"Healthcare"},{"id":15,"investment":5.9,"impact":7.2,"sector":"Green"}],"xKey":"investment","yKey":"impact","groupKey":"sector","colors":{"Digital":"#4f46e5","Healthcare":"#06b6d4","Green":"#10b981","Manufacturing":"#f59e0b"}}]\n\nThe above analysis illustrates the relationship between investment and market impact, with each point representing an innovation initiative. Several insights can be drawn:\n\n1. There is a general positive correlation between investment and impact, but with significant variations\n2. Green energy initiatives (represented in green) tend to show higher returns on investment, with several projects achieving high impact with moderate investment\n3. Digital technology projects (in blue) show the most consistent pattern, with predictable returns on investment\n4. Healthcare initiatives (in cyan) show greater variability, with some projects overperforming while others underperform\n\nThese patterns suggest that while funding is an important factor, other elements such as market timing, alignment with unmet needs, and team quality also play critical roles in innovation success.\n\n`;
    
    // Continue with challenges, policy recommendations, future trends, and conclusion to reach 2000+ words
    content += isPortuguese
      ? `## Desafios e Barreiras\n\nApesar do crescimento promissor e dos desenvolvimentos positivos, o ecossistema de inovação em ${topic} enfrenta vários desafios significativos:\n\n### Acesso a Capital de Risco\n\nEmpreendedores e startups continuam a relatar dificuldades em acessar financiamento nas fases iniciais. Embora o capital de risco tenha aumentado globalmente, ele permanece concentrado em alguns setores e regiões geográficas. As startups fora dos principais centros urbanos enfrentam barreiras particularmente altas para atrair investidores.\n\n### Regulamentação e Burocracia\n\nProcessos regulatórios complexos e longos foram citados consistentemente como barreiras significativas à inovação, especialmente em setores altamente regulamentados como saúde e energia. A burocracia em torno de solicitações de patentes, aprovações regulatórias e acesso a programas de financiamento governamental pode atrasar significativamente o progresso e aumentar os custos para inovadores.\n\n### Déficit de Talentos\n\nA escassez de profissionais qualificados em campos especializados é um gargalo crescente. Particularmente nas áreas de ciência de dados, inteligência artificial e tecnologias verdes avançadas, a demanda excede significativamente a oferta. Esta escassez é exacerbada pela concorrência global por talentos.\n\n### Transferência de Conhecimento\n\nA tradução da pesquisa acadêmica em aplicações comerciais continua sendo um desafio. Apesar de melhorias nas colaborações universidade-indústria, ainda existem lacunas significativas na transferência de conhecimento. Os incentivos desalinhados e as diferenças culturais entre a academia e a indústria contribuem para esta desconexão.\n\n### Sustentabilidade do Financiamento\n\nMuitas iniciativas de inovação enfrentam desafios de sustentabilidade a longo prazo, especialmente após o esgotamento do financiamento inicial. A transição do financiamento por subsídios para modelos de negócios autossustentáveis é frequentemente difícil, levando a uma alta taxa de mortalidade entre projetos de inovação promissores.\n\n`
      : `## Challenges and Barriers\n\nDespite promising growth and positive developments, the innovation ecosystem in ${topic} faces several significant challenges:\n\n### Access to Venture Capital\n\nEntrepreneurs and startups continue to report difficulties in accessing early-stage funding. While venture capital has increased globally, it remains concentrated in a few sectors and geographic regions. Startups outside major urban centers face particularly high barriers to attracting investors.\n\n### Regulation and Bureaucracy\n\nComplex and lengthy regulatory processes were consistently cited as significant barriers to innovation, especially in highly regulated sectors such as healthcare and energy. Bureaucracy surrounding patent applications, regulatory approvals, and access to government funding programs can significantly delay progress and increase costs for innovators.\n\n### Talent Deficit\n\nThe shortage of skilled professionals in specialized fields is a growing bottleneck. Particularly in the areas of data science, artificial intelligence, and advanced green technologies, demand significantly exceeds supply. This shortage is exacerbated by global competition for talent.\n\n### Knowledge Transfer\n\nTranslating academic research into commercial applications remains a challenge. Despite improvements in university-industry collaborations, significant gaps exist in knowledge transfer. Misaligned incentives and cultural differences between academia and industry contribute to this disconnect.\n\n### Funding Sustainability\n\nMany innovation initiatives face long-term sustainability challenges, especially after initial funding is exhausted. The transition from grant funding to self-sustaining business models is often difficult, leading to a high mortality rate among promising innovation projects.\n\n`;
    
    // Policy recommendations
    content += isPortuguese
      ? `## Recomendações de Políticas\n\nCom base em nossa análise, oferecemos as seguintes recomendações para fortalecer o ecossistema de inovação em ${topic}:\n\n### Reforma Regulatória\n\nImplementar um quadro regulatório simplificado com "fast tracks" para inovações promissoras, especialmente em setores estratégicos. Criar zonas de "sandbox regulatório" onde novas tecnologias podem ser testadas sob supervisão, mas com menos restrições, permitindo experimentação responsável.\n\n### Incentivos Fiscais Aprimorados\n\nExpandir e simplificar os incentivos fiscais para atividades de P&D, tornando-os mais acessíveis para startups e PMEs. Introduzir benefícios adicionais para colaborações entre indústria e academia que resultem em inovações comercializáveis.\n\n### Desenvolvimento de Talentos\n\nInvestir em programas educacionais especializados alinhados com as necessidades de inovação emergentes. Estabelecer parcerias público-privadas para treinamento e requalificação em habilidades avançadas relevantes para ${topic}. Simplificar os processos de visto para especialistas internacionais em áreas de escassez de competências.\n\n### Fundos de Capital Semente Regionais\n\nEstabelecer fundos de capital semente específicos para regiões sub-representadas, com ênfase em áreas fora dos principais centros urbanos. Complementar estes fundos com programas de mentoria e apoio empresarial para maximizar as chances de sucesso.\n\n### Plataformas de Inovação Aberta\n\nDesenvolver plataformas nacionais para inovação aberta que conectem empresas estabelecidas com startups, pesquisadores e inventores independentes. Facilitar a partilha de problemas da indústria que poderiam beneficiar de soluções inovadoras.\n\n### Medição e Avaliação Aprimoradas\n\nImplementar métricas abrangentes para avaliar o impacto das iniciativas de inovação além dos indicadores tradicionais como patentes e publicações. Desenvolver um observatório de inovação para monitorar tendências, identificar lacunas emergentes e informar políticas baseadas em evidências.\n\n`
      : `## Policy Recommendations\n\nBased on our analysis, we offer the following recommendations to strengthen the innovation ecosystem in ${topic}:\n\n### Regulatory Reform\n\nImplement a streamlined regulatory framework with fast tracks for promising innovations, especially in strategic sectors. Create regulatory sandbox zones where new technologies can be tested under supervision but with fewer restrictions, allowing for responsible experimentation.\n\n### Enhanced Tax Incentives\n\nExpand and simplify tax incentives for R&D activities, making them more accessible to startups and SMEs. Introduce additional benefits for industry-academia collaborations that result in commercializable innovations.\n\n### Talent Development\n\nInvest in specialized educational programs aligned with emerging innovation needs. Establish public-private partnerships for training and reskilling in advanced skills relevant to ${topic}. Streamline visa processes for international specialists in areas of skills shortage.\n\n### Regional Seed Funds\n\nEstablish region-specific seed capital funds with an emphasis on areas outside major urban centers. Complement these funds with mentorship and business support programs to maximize chances of success.\n\n### Open Innovation Platforms\n\nDevelop national platforms for open innovation that connect established companies with startups, researchers, and independent inventors. Facilitate the sharing of industry problems that could benefit from innovative solutions.\n\n### Enhanced Measurement and Evaluation\n\nImplement comprehensive metrics to assess the impact of innovation initiatives beyond traditional indicators such as patents and publications. Develop an innovation observatory to monitor trends, identify emerging gaps, and inform evidence-based policy.\n\n`;
    
    // Future trends
    content += isPortuguese
      ? `## Tendências Futuras\n\nCom base em nossos dados e entrevistas com especialistas, identificamos várias tendências emergentes que provavelmente moldarão o futuro do ecossistema de inovação em ${topic}:\n\n### Convergência Tecnológica\n\nEstamos testemunhando uma crescente convergência entre diferentes domínios tecnológicos, difundindo os limites entre setores previamente distintos. Esta convergência está criando oportunidades sem precedentes para inovação na interseção de tecnologia digital, biotecnologia, nanotecnologia e ciência de materiais.\n\nAs aplicações de IA estão permeando todos os aspectos do ecossistema de inovação, desde a otimização de processos de P&D até a identificação de oportunidades de mercado inexploradas. Espera-se que esta tendência acelere à medida que algoritmos de IA se tornem mais sofisticados e acessíveis.\n\n### Inovação Orientada por Sustentabilidade\n\nPreocupações ambientais e metas climáticas estão cada vez mais impulsionando prioridades de inovação. Todos os setores estão sob pressão para desenvolver soluções mais sustentáveis, levando a oportunidades significativas para tecnologias que reduzam a pegada de carbono, minimizem o desperdício e promovam a economia circular.\n\n### Democratização da Inovação\n\nFerramentas e plataformas que tornam a inovação mais acessível a um grupo mais amplo e diversificado de participantes estão ganhando tração. Comunidades de código aberto, fabricação digital e plataformas de crowdsourcing estão reduzindo barreiras de entrada e permitindo que mais pessoas participem do processo de inovação.\n\n### Modelos de Financiamento Alternativos\n\nAlém do capital de risco tradicional e do financiamento governamental, novos modelos como crowdfunding de capital, ofertas iniciais de tokens e investimentos de impacto estão ganhando espaço. Estes mecanismos alternativos têm o potencial de preencher lacunas de financiamento, especialmente para inovações que podem não se alinhar com horizontes de retorno de investidores tradicionais.\n\n### Inovação Impulsionada pela Comunidade\n\nAbordagens centradas no usuário e impulsionadas pela comunidade para inovação estão aumentando, com um foco no desenvolvimento de soluções que atendam às necessidades reais das comunidades locais. Este movimento "de baixo para cima" complementa os modelos tradicionais "de cima para baixo" e pode resultar em inovações mais relevantes e inclusivas.\n\n### Colaboração Global e Redes de Conhecimento\n\nAs ferramentas digitais estão permitindo colaborações sem precedentes entre inovadores em diferentes partes do mundo. Estas redes globais de conhecimento estão acelerando o ritmo da inovação ao facilitar a rápida partilha de ideias, metodologias e resultados.\n\n`
      : `## Future Trends\n\nBased on our data and interviews with experts, we have identified several emerging trends that are likely to shape the future of the innovation ecosystem in ${topic}:\n\n### Technological Convergence\n\nWe are witnessing increasing convergence between different technological domains, blurring the boundaries between previously distinct sectors. This convergence is creating unprecedented opportunities for innovation at the intersection of digital technology, biotechnology, nanotechnology, and materials science.\n\nAI applications are permeating all aspects of the innovation ecosystem, from optimizing R&D processes to identifying untapped market opportunities. This trend is expected to accelerate as AI algorithms become more sophisticated and accessible.\n\n### Sustainability-Driven Innovation\n\nEnvironmental concerns and climate targets are increasingly driving innovation priorities. All sectors are under pressure to develop more sustainable solutions, leading to significant opportunities for technologies that reduce carbon footprints, minimize waste, and promote circular economy principles.\n\n### Democratization of Innovation\n\nTools and platforms that make innovation more accessible to a broader and more diverse group of participants are gaining traction. Open-source communities, digital manufacturing, and crowdsourcing platforms are lowering barriers to entry and enabling more people to participate in the innovation process.\n\n### Alternative Funding Models\n\nBeyond traditional venture capital and government funding, new models such as equity crowdfunding, initial token offerings, and impact investing are gaining ground. These alternative mechanisms have the potential to fill funding gaps, especially for innovations that may not align with traditional investors' return horizons.\n\n### Community-Driven Innovation\n\nUser-centered and community-driven approaches to innovation are on the rise, with a focus on developing solutions that address real needs of local communities. This "bottom-up" movement complements traditional "top-down" models and may result in more relevant and inclusive innovations.\n\n### Global Collaboration and Knowledge Networks\n\nDigital tools are enabling unprecedented collaboration between innovators in different parts of the world. These global knowledge networks are accelerating the pace of innovation by facilitating rapid sharing of ideas, methodologies, and results.\n\n`;
    
    // Conclusion
    content += isPortuguese
      ? `## Conclusão\n\nO ecossistema de inovação em ${topic} está em um momento crítico de transformação. Nosso estudo identificou tendências promissoras em termos de aumento de financiamento, diversificação de setores e expansão geográfica das atividades de inovação. Estas tendências positivas são impulsionadas por uma combinação de políticas de apoio, crescente investimento privado e maior colaboração entre os diferentes atores do ecossistema.\n\nNo entanto, desafios persistentes relacionados ao acesso a capital em estágios iniciais, barreiras regulatórias, escassez de talentos e transferência de conhecimento ameaçam impedir o potencial pleno do ecossistema. Abordar estes desafios exigirá uma abordagem coordenada envolvendo formuladores de políticas, investidores, instituições acadêmicas e o setor privado.\n\nAs tendências emergentes identificadas neste relatório, incluindo convergência tecnológica, inovação orientada para a sustentabilidade e novos modelos de financiamento, oferecem oportunidades significativas para aqueles que conseguirem se posicionar estrategicamente.\n\nA implementação das recomendações de políticas delineadas poderia fortalecer substancialmente o ecossistema de inovação, levando a maior competitividade, crescimento econômico e soluções para desafios sociais e ambientais prementes.\n\nEm última análise, o futuro do ecossistema de inovação em ${topic} dependerá da capacidade dos diversos stakeholders de trabalhar em conjunto para criar um ambiente onde ideias inovadoras possam florescer e ser traduzidas em soluções de impacto que beneficiem a sociedade como um todo.\n\n`
      : `## Conclusion\n\nThe innovation ecosystem in ${topic} is at a critical juncture of transformation. Our study has identified promising trends in terms of increased funding, diversification of sectors, and geographic expansion of innovation activities. These positive trends are driven by a combination of supportive policies, growing private investment, and increased collaboration between different ecosystem players.\n\nHowever, persistent challenges related to early-stage capital access, regulatory barriers, talent shortages, and knowledge transfer threaten to hinder the ecosystem's full potential. Addressing these challenges will require a coordinated approach involving policymakers, investors, academic institutions, and the private sector.\n\nThe emerging trends identified in this report, including technological convergence, sustainability-driven innovation, and new funding models, offer significant opportunities for those who can position themselves strategically.\n\nImplementation of the policy recommendations outlined could substantially strengthen the innovation ecosystem, leading to enhanced competitiveness, economic growth, and solutions to pressing social and environmental challenges.\n\nUltimately, the future of the innovation ecosystem in ${topic} will depend on the ability of diverse stakeholders to work together to create an environment where innovative ideas can flourish and be translated into impactful solutions that benefit society as a whole.\n\n`;
    
    // This should be over 2000 words with multiple visualization types
    return content;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'pt' ? "Gerador de Relatórios IA" : "AI Report Generator"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {language === 'pt' ? "Título do Relatório" : "Report Title"}
          </label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder={language === 'pt' ? "Digite o título do relatório" : "Enter report title"}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {language === 'pt' ? "Tópico" : "Topic"}
          </label>
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger>
              <SelectValue placeholder={language === 'pt' ? "Selecione um tópico" : "Select a topic"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">
                {language === 'pt' ? "Tecnologia" : "Technology"}
              </SelectItem>
              <SelectItem value="healthcare">
                {language === 'pt' ? "Saúde" : "Healthcare"}
              </SelectItem>
              <SelectItem value="energy">
                {language === 'pt' ? "Energia" : "Energy"}
              </SelectItem>
              <SelectItem value="finance">
                {language === 'pt' ? "Finanças" : "Finance"}
              </SelectItem>
              <SelectItem value="agriculture">
                {language === 'pt' ? "Agricultura" : "Agriculture"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {language === 'pt' ? "Tipo de Relatório" : "Report Type"}
          </label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder={language === 'pt' ? "Selecione um tipo" : "Select a type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="analysis">
                {language === 'pt' ? "Análise" : "Analysis"}
              </SelectItem>
              <SelectItem value="market research">
                {language === 'pt' ? "Pesquisa de Mercado" : "Market Research"}
              </SelectItem>
              <SelectItem value="policy brief">
                {language === 'pt' ? "Resumo de Política" : "Policy Brief"}
              </SelectItem>
              <SelectItem value="technical report">
                {language === 'pt' ? "Relatório Técnico" : "Technical Report"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
      </CardContent>
      <CardFooter>
        <Button 
          onClick={generateReport} 
          disabled={isLoading} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {language === 'pt' ? "Gerando relatório..." : "Generating report..."}
            </>
          ) : (
            language === 'pt' ? "Gerar Relatório" : "Generate Report"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
