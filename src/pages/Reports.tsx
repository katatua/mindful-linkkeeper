
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Plus, Calendar, FileText, RefreshCw } from "lucide-react";
import { ReportsList } from "@/components/reports/ReportsList";
import { ReportTemplates } from "@/components/reports/ReportTemplates";
import { ScheduledReports } from "@/components/reports/ScheduledReports";

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Reports & Documentation</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search reports..."
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
            <Plus className="h-4 w-4 mr-1" /> New Report
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all-reports" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all-reports">All Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="automated">Automated Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Total Reports</CardTitle>
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124</div>
                <p className="text-sm text-gray-600">Last 12 months</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Generated Reports</CardTitle>
                  <RefreshCw className="h-5 w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-sm text-gray-600">This quarter</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Scheduled Reports</CardTitle>
                  <Calendar className="h-5 w-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-sm text-gray-600">Active schedules</p>
              </CardContent>
            </Card>
          </div>
          
          <ReportsList searchQuery={searchQuery} />
        </TabsContent>
        
        <TabsContent value="templates">
          <ReportTemplates />
        </TabsContent>
        
        <TabsContent value="automated">
          <Card>
            <CardHeader>
              <CardTitle>Automated Reports</CardTitle>
              <CardDescription>Configure reports that are automatically generated based on triggers or events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Monthly Project Performance</CardTitle>
                    <Badge>Active</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Automatically generates a performance report at the end of each month.</p>
                  </CardContent>
                  <CardFooter className="border-t flex justify-between pt-4">
                    <span className="text-xs text-gray-500">Last run: Jun 30, 2023</span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Funding Allocation Report</CardTitle>
                    <Badge>Active</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Generates report when new funding is allocated to any project.</p>
                  </CardContent>
                  <CardFooter className="border-t flex justify-between pt-4">
                    <span className="text-xs text-gray-500">Last run: Jul 12, 2023</span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Project Milestone Report</CardTitle>
                    <Badge>Active</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Generates a report when a project reaches a key milestone.</p>
                  </CardContent>
                  <CardFooter className="border-t flex justify-between pt-4">
                    <span className="text-xs text-gray-500">Last run: Jul 8, 2023</span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Innovation Metrics Report</CardTitle>
                    <Badge variant="outline">Paused</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Quarterly report on key innovation metrics and KPIs.</p>
                  </CardContent>
                  <CardFooter className="border-t flex justify-between pt-4">
                    <span className="text-xs text-gray-500">Last run: Mar 31, 2023</span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled">
          <ScheduledReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
