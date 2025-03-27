
import React, { useState } from 'react';
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface SyntheticDataFormValues {
  table: string;
  count: number;
}

const SyntheticDataPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SyntheticDataFormValues>({
    defaultValues: {
      table: "ani_funding_programs",
      count: 10
    }
  });

  const generateRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };
  
  const generateRandomAmount = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const generateUUID = () => {
    return crypto.randomUUID();
  };

  const getRandomItem = <T extends any>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
  };

  const generateFundingPrograms = async (count: number) => {
    const sectors = ['Technology', 'Healthcare', 'Agriculture', 'Education', 'Manufacturing', 'Clean Energy', 'Tourism', 'Digital Transformation'];
    // Update funding types to match database constraints
    const fundingTypes = ['grant', 'loan', 'tax_incentive', 'equity', 'hybrid'];
    const programs = [];
    
    const now = new Date();
    const oneYearFromNow = new Date(now);
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    for (let i = 0; i < count; i++) {
      const applicationDeadline = generateRandomDate(now, oneYearFromNow);
      const endDate = new Date(applicationDeadline);
      endDate.setMonth(applicationDeadline.getMonth() + Math.floor(Math.random() * 24) + 6);
      
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 90));
      
      const program = {
        name: `Funding Program ${i + 1} - ${getRandomItem(sectors)}`,
        description: `This is a synthetic funding program for ${getRandomItem(sectors)} sector with a focus on innovation and research.`,
        total_budget: generateRandomAmount(100000, 10000000),
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        application_deadline: format(applicationDeadline, 'yyyy-MM-dd'),
        next_call_date: format(generateRandomDate(now, applicationDeadline), 'yyyy-MM-dd'),
        funding_type: getRandomItem(fundingTypes),
        sector_focus: [getRandomItem(sectors), getRandomItem(sectors)].filter((v, i, a) => a.indexOf(v) === i),
        eligibility_criteria: 'Organizations must be registered in Portugal and have at least 2 years of operation.',
        application_process: 'Online application through ANI portal with required documentation.',
        review_time_days: generateRandomAmount(30, 90),
        success_rate: Math.random() * 0.7 + 0.1, // 10% to 80% success rate
      };
      
      programs.push(program);
    }
    
    return programs;
  };
  
  const generateProjects = async (count: number) => {
    const sectors = ['Technology', 'Healthcare', 'Agriculture', 'Education', 'Manufacturing', 'Clean Energy', 'Tourism', 'Digital Transformation'];
    const regions = ['Lisboa', 'Porto', 'Algarve', 'Centro', 'Alentejo', 'Norte', 'Açores', 'Madeira'];
    const statuses = ['submitted', 'in_review', 'approved', 'completed', 'rejected'];
    const organizations = ['Universidade de Lisboa', 'Universidade do Porto', 'Instituto Superior Técnico', 'Universidade de Coimbra', 'Universidade do Minho', 'INESC TEC', 'INOV', 'INESC ID'];
    
    const projects = [];
    
    const now = new Date();
    const twoYearsAgo = new Date(now);
    twoYearsAgo.setFullYear(now.getFullYear() - 2);
    
    const threeYearsFromNow = new Date(now);
    threeYearsFromNow.setFullYear(now.getFullYear() + 3);
    
    for (let i = 0; i < count; i++) {
      const startDate = generateRandomDate(twoYearsAgo, now);
      const endDate = generateRandomDate(now, threeYearsFromNow);
      
      const project = {
        title: `Research Project ${i + 1} - ${getRandomItem(sectors)}`,
        description: `This is a synthetic research project focused on innovation in the ${getRandomItem(sectors)} sector.`,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        funding_amount: generateRandomAmount(50000, 500000),
        status: getRandomItem(statuses),
        sector: getRandomItem(sectors),
        region: getRandomItem(regions),
        organization: getRandomItem(organizations),
        contact_email: `contact${i}@example.com`,
        contact_phone: `+351 9${generateRandomAmount(10000000, 99999999)}`,
      };
      
      projects.push(project);
    }
    
    return projects;
  };
  
  const generateMetrics = async (count: number) => {
    const metrics = [];
    const categories = ['R&D Investment', 'Patent Applications', 'Innovation Index', 'Startup Funding', 'Academic Collaboration'];
    const sectors = ['Technology', 'Healthcare', 'Agriculture', 'Education', 'Manufacturing', 'Clean Energy', 'Tourism', 'Digital Transformation'];
    const regions = ['Lisboa', 'Porto', 'Algarve', 'Centro', 'Alentejo', 'Norte', 'Açores', 'Madeira'];
    const units = ['Million EUR', 'Percentage', 'Count', 'Per Capita', 'Growth Rate'];
    const sources = ['Eurostat', 'INE', 'ANI Survey', 'Ministry Report', 'EU Commission'];
    
    const now = new Date();
    const fiveYearsAgo = new Date(now);
    fiveYearsAgo.setFullYear(now.getFullYear() - 5);
    
    for (let i = 0; i < count; i++) {
      const measurementDate = generateRandomDate(fiveYearsAgo, now);
      
      const metric = {
        name: `${getRandomItem(categories)} Metric ${i + 1}`,
        category: getRandomItem(categories),
        value: Math.random() * 100,
        unit: getRandomItem(units),
        measurement_date: format(measurementDate, 'yyyy-MM-dd'),
        region: getRandomItem(regions),
        sector: getRandomItem(sectors),
        source: getRandomItem(sources),
        description: `Synthetic metric measuring ${getRandomItem(categories)} in ${getRandomItem(sectors)} sector for ${getRandomItem(regions)} region.`,
      };
      
      metrics.push(metric);
    }
    
    return metrics;
  };

  const generateCollaborations = async (count: number) => {
    const countries = ['Spain', 'France', 'Germany', 'United Kingdom', 'Italy', 'Netherlands', 'Belgium', 'Sweden', 'United States', 'Brazil', 'Japan', 'China'];
    const partnershipTypes = ['Research', 'Academic Exchange', 'Industry Collaboration', 'Government Partnership', 'Innovation Hub'];
    const focusAreas = ['AI', 'Renewable Energy', 'Biotechnology', 'Advanced Materials', 'Digital Transformation', 'Climate Action', 'Space Technology', 'Quantum Computing'];
    
    const collaborations = [];
    
    const now = new Date();
    const twoYearsAgo = new Date(now);
    twoYearsAgo.setFullYear(now.getFullYear() - 2);
    
    const fiveYearsFromNow = new Date(now);
    fiveYearsFromNow.setFullYear(now.getFullYear() + 5);
    
    for (let i = 0; i < count; i++) {
      const startDate = generateRandomDate(twoYearsAgo, now);
      const endDate = generateRandomDate(now, fiveYearsFromNow);
      const totalBudget = generateRandomAmount(200000, 2000000);
      
      const collaboration = {
        program_name: `International Collaboration ${i + 1} with ${getRandomItem(countries)}`,
        country: getRandomItem(countries),
        partnership_type: getRandomItem(partnershipTypes),
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        total_budget: totalBudget,
        portuguese_contribution: Math.floor(totalBudget * (Math.random() * 0.4 + 0.2)), // 20-60% of total
        focus_areas: [getRandomItem(focusAreas), getRandomItem(focusAreas)].filter((v, i, a) => a.indexOf(v) === i),
      };
      
      collaborations.push(collaboration);
    }
    
    return collaborations;
  };

  const onSubmit = async (values: SyntheticDataFormValues) => {
    try {
      setIsGenerating(true);
      let data = [];
      
      // Generate data based on selected table
      switch (values.table) {
        case 'ani_funding_programs':
          data = await generateFundingPrograms(values.count);
          break;
        case 'ani_projects':
          data = await generateProjects(values.count);
          break;
        case 'ani_metrics':
          data = await generateMetrics(values.count);
          break;
        case 'ani_international_collaborations':
          data = await generateCollaborations(values.count);
          break;
        default:
          throw new Error('Unsupported table type');
      }
      
      // Insert data into the database
      const { error } = await supabase
        .from(values.table)
        .insert(data);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success!",
        description: `Generated ${values.count} synthetic records for ${values.table}`,
      });
    } catch (error) {
      console.error('Error generating synthetic data:', error);
      toast({
        title: "Error generating data",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Synthetic Data Generator</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Generate Test Data</CardTitle>
            <CardDescription>
              Create synthetic data for testing and development purposes. Data will be saved to the selected table in the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="table">Target Table</Label>
                  <Select
                    defaultValue={form.getValues().table}
                    onValueChange={(value) => form.setValue('table', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a table" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ani_funding_programs">Funding Programs</SelectItem>
                      <SelectItem value="ani_projects">Projects</SelectItem>
                      <SelectItem value="ani_metrics">Metrics</SelectItem>
                      <SelectItem value="ani_international_collaborations">International Collaborations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="count">Number of Records</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="100"
                    {...form.register('count', { 
                      valueAsNumber: true,
                      min: { value: 1, message: "Must generate at least 1 record" },
                      max: { value: 100, message: "Cannot generate more than 100 records at once" }
                    })}
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={isGenerating} className="w-full md:w-auto">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Data"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Synthetic Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                This tool generates realistic synthetic data for testing and development. The generated data follows the schema of the ANI database tables and includes:
              </p>
              
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Funding Programs:</strong> Creates funding programs with realistic deadlines, budgets, and sector focus.</li>
                <li><strong>Projects:</strong> Generates research projects with appropriate funding amounts, statuses, and regional distribution.</li>
                <li><strong>Metrics:</strong> Creates metrics data for tracking innovations, investments, and other key indicators.</li>
                <li><strong>International Collaborations:</strong> Generates data about international partnerships with various countries.</li>
              </ul>
              
              <p className="text-sm text-muted-foreground">
                Note: All generated data is fictional and should only be used for testing purposes. The generated records follow realistic patterns but do not represent actual ANI programs or projects.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SyntheticDataPage;
