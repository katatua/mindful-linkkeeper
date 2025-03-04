
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Framework {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  priority_areas: string[];
  key_initiatives: string[];
}

interface PolicyFrameworksProps {
  className?: string;
}

export const PolicyFrameworks = ({ className }: PolicyFrameworksProps) => {
  // Sample data for policy frameworks
  const frameworks: Framework[] = [
    {
      id: "enei2030",
      name: "ENEI 2030",
      description: "National Innovation Strategy 2030 focusing on digital transformation and knowledge economy",
      timeframe: "2023-2030",
      priority_areas: [
        "Digital Transformation",
        "Circular Economy",
        "Health Innovation",
        "Energy Transition",
        "Space Economy"
      ],
      key_initiatives: [
        "Innovation Vouchers Program",
        "Digital Skills Academy",
        "Green Tech Innovation Fund",
        "Health Data Innovation Platform"
      ]
    },
    {
      id: "portugal2030",
      name: "Portugal 2030",
      description: "Strategic framework to implement European funds and boost innovation ecosystem",
      timeframe: "2021-2030",
      priority_areas: [
        "Competitiveness and Innovation",
        "Climate Transition",
        "Demographic Sustainability",
        "Territorial Development"
      ],
      key_initiatives: [
        "Innovation Agenda for Agriculture",
        "Blue Economy Innovation Program",
        "Smart Cities Network",
        "Industrial Innovation Partnerships"
      ]
    },
    {
      id: "horizon",
      name: "Horizon Europe",
      description: "European framework for research and innovation aligned with national strategies",
      timeframe: "2021-2027",
      priority_areas: [
        "Health Cluster",
        "Digital & Industry Cluster",
        "Climate & Energy Cluster",
        "Food & Natural Resources"
      ],
      key_initiatives: [
        "European Innovation Council",
        "European Research Council",
        "Marie Skłodowska-Curie Actions",
        "Research Infrastructures"
      ]
    }
  ];

  return (
    <div className={className}>
      <Tabs defaultValue="enei2030">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="enei2030">ENEI 2030</TabsTrigger>
          <TabsTrigger value="portugal2030">Portugal 2030</TabsTrigger>
          <TabsTrigger value="horizon">Horizon Europe</TabsTrigger>
        </TabsList>

        {frameworks.map((framework) => (
          <TabsContent key={framework.id} value={framework.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{framework.name}</CardTitle>
                <CardDescription>{framework.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Timeframe</h3>
                    <p className="text-gray-600 mb-4">{framework.timeframe}</p>
                    
                    <h3 className="text-lg font-medium mb-2">Priority Areas</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {framework.priority_areas.map((area, index) => (
                        <li key={index} className="text-gray-600">{area}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Key Initiatives</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {framework.key_initiatives.map((initiative, index) => (
                        <li key={index} className="text-gray-600">{initiative}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PolicyFrameworks;
