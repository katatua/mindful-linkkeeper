
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ReportVisualizer, extractVisualizations } from "./ReportVisualizer";

export const ReportGenerator = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState("Innovation in renewable energy");
  const [location, setLocation] = useState("Portugal");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [reportStyle, setReportStyle] = useState("formal");
  const [generatedReport, setGeneratedReport] = useState("");
  const [visualizations, setVisualizations] = useState<any[]>([]);

  const generateReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      let reportContent = "";
      
      // For renewable energy topics, generate a more specialized report
      if (topic.toLowerCase().includes("renewable") || topic.toLowerCase().includes("energy")) {
        reportContent = generateRenewableEnergyReport(location, year);
      } else {
        reportContent = generateGeneralReport(topic, location, year, reportStyle);
      }
      
      // Extract visualizations from the report content
      const extractedVisualizations = extractVisualizations(reportContent);
      
      setGeneratedReport(reportContent);
      setVisualizations(extractedVisualizations);
      setIsLoading(false);

      toast({
        title: "Report Generated",
        description: `Your report on ${topic} in ${location} for ${year} has been created.`,
        duration: 3000
      });
    }, 2000);
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

  // Function to render the report with visualizations inserted at appropriate places
  const renderReportWithVisualizations = () => {
    if (!generatedReport) return null;
    
    // Split the report into sections at visualization placeholders
    const visualizationPlaceholderRegex = /Insert Visualization \d+\s*\([^)]+\)/g;
    const sections = generatedReport.split(visualizationPlaceholderRegex);
    const placeholders = generatedReport.match(visualizationPlaceholderRegex) || [];
    
    // Create an array of content and visualizations alternating
    const result = [];
    
    for (let i = 0; i < sections.length; i++) {
      // Add the text section
      if (sections[i].trim()) {
        result.push(
          <div key={`text-${i}`} className="my-4 prose max-w-none" dangerouslySetInnerHTML={{ 
            __html: sections[i]
              .replace(/# (.*)/g, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
              .replace(/## (.*)/g, '<h2 class="text-xl font-semibold mt-5 mb-3">$1</h2>')
              .replace(/\n\n/g, '</p><p>') 
          }} />
        );
      }
      
      // Add the visualization if there is one for this position
      if (i < placeholders.length) {
        const vizIndex = placeholders[i].match(/Insert Visualization (\d+)/)?.[1];
        const vizNumber = vizIndex ? parseInt(vizIndex) - 1 : i;
        
        if (visualizations[vizNumber]) {
          result.push(
            <div key={`viz-${i}`} className="my-6 p-4 bg-gray-50 rounded-lg border">
              <ReportVisualizer visualization={visualizations[vizNumber]} />
            </div>
          );
        }
      }
    }
    
    return result;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Report Generator</CardTitle>
          <CardDescription>
            Generate comprehensive reports with visualizations on various innovation topics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Report Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Innovation in renewable energy"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Portugal"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                placeholder="e.g., 2023"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="style">Report Style</Label>
              <Select value={reportStyle} onValueChange={setReportStyle}>
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal Academic</SelectItem>
                  <SelectItem value="business">Business-oriented</SelectItem>
                  <SelectItem value="policy">Policy-focused</SelectItem>
                  <SelectItem value="technical">Technical Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={generateReport} 
            disabled={isLoading}
          >
            {isLoading ? "Generating Report..." : "Generate AI Report"}
          </Button>
        </CardContent>
      </Card>
      
      {generatedReport && (
        <Card>
          <CardHeader>
            <CardTitle>{`${topic} in ${location} (${year})`}</CardTitle>
            <CardDescription>
              Generated report with integrated data visualizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderReportWithVisualizations()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              Download PDF
            </Button>
            <Button variant="outline">
              Share Report
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
