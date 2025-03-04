
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, Calendar, FileText, ArrowUpRight } from "lucide-react";
import { PolicyList } from "@/components/policies/PolicyList";
import { PolicyFrameworks } from "@/components/policies/PolicyFrameworks";
import { PolicyImpact } from "@/components/policies/PolicyImpact";

const Policies = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Innovation Policies</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search policies..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-1" /> Date
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> New Policy
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Active Policies</CardTitle>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-sm text-gray-600">Currently in effect</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Policy Frameworks</CardTitle>
              <FileText className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-sm text-gray-600">Major frameworks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Impact Assessments</CardTitle>
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-sm text-gray-600">Completed assessments</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all-policies" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all-policies">All Policies</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="impact">Impact Assessment</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-policies" className="space-y-6">
          <PolicyList searchQuery={searchQuery} />
        </TabsContent>
        
        <TabsContent value="frameworks">
          <PolicyFrameworks />
        </TabsContent>
        
        <TabsContent value="impact">
          <PolicyImpact />
        </TabsContent>
        
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Dashboard</CardTitle>
              <CardDescription>Track compliance with national and international innovation policy requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">EU Innovation Regulations</CardTitle>
                    <Badge variant="outline">98% Compliant</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Compliance with EU innovation funding and reporting requirements.</p>
                  </CardContent>
                  <CardFooter className="border-t flex justify-between pt-4">
                    <span className="text-xs text-gray-500">Last audit: Jun 15, 2023</span>
                    <Button variant="outline" size="sm">View Details</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">National Innovation Framework</CardTitle>
                    <Badge variant="outline">100% Compliant</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Alignment with Portugal's national innovation strategy and requirements.</p>
                  </CardContent>
                  <CardFooter className="border-t flex justify-between pt-4">
                    <span className="text-xs text-gray-500">Last audit: Jul 5, 2023</span>
                    <Button variant="outline" size="sm">View Details</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">IP Protection Standards</CardTitle>
                    <Badge variant="outline">92% Compliant</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Compliance with intellectual property protection standards and regulations.</p>
                  </CardContent>
                  <CardFooter className="border-t flex justify-between pt-4">
                    <span className="text-xs text-gray-500">Last audit: Jun 28, 2023</span>
                    <Button variant="outline" size="sm">View Details</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Data Protection Regulations</CardTitle>
                    <Badge variant="outline">95% Compliant</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">GDPR and other data protection compliance for innovation projects.</p>
                  </CardContent>
                  <CardFooter className="border-t flex justify-between pt-4">
                    <span className="text-xs text-gray-500">Last audit: Jul 10, 2023</span>
                    <Button variant="outline" size="sm">View Details</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Policies;
