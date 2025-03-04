
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Settings, Play, Pause } from "lucide-react";

export const ScheduledReports = () => {
  // Sample data for scheduled reports
  const scheduledReports = [
    {
      id: "SCHED-001",
      title: "Weekly Project Status Report",
      description: "Summary of all active projects and their current status",
      frequency: "Weekly",
      nextRun: "Jul 24, 2023",
      time: "09:00",
      recipients: ["Project Managers", "Executive Team"],
      active: true
    },
    {
      id: "SCHED-002",
      title: "Monthly Innovation Metrics",
      description: "Key innovation metrics and KPIs from the past month",
      frequency: "Monthly",
      nextRun: "Aug 1, 2023",
      time: "08:00",
      recipients: ["All Department Heads", "Executive Team"],
      active: true
    },
    {
      id: "SCHED-003",
      title: "Quarterly Funding Report",
      description: "Detailed analysis of funding allocation and budget adherence",
      frequency: "Quarterly",
      nextRun: "Sep 30, 2023",
      time: "10:00",
      recipients: ["Finance Department", "Executive Team", "Board of Directors"],
      active: true
    },
    {
      id: "SCHED-004",
      title: "Monthly Patent Activity Report",
      description: "Summary of new patent applications and granted patents",
      frequency: "Monthly",
      nextRun: "Aug 1, 2023",
      time: "14:00",
      recipients: ["Legal Department", "R&D Teams"],
      active: false
    },
    {
      id: "SCHED-005",
      title: "Bi-weekly Sector Performance",
      description: "Comparison of performance metrics across different innovation sectors",
      frequency: "Bi-weekly",
      nextRun: "Jul 28, 2023",
      time: "11:00",
      recipients: ["Sector Managers", "Strategy Team"],
      active: true
    },
    {
      id: "SCHED-006",
      title: "Annual Innovation Review",
      description: "Comprehensive review of annual innovation activities and outcomes",
      frequency: "Annually",
      nextRun: "Dec 31, 2023",
      time: "09:00",
      recipients: ["All Staff", "Board of Directors", "External Stakeholders"],
      active: true
    }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>Reports that are automatically generated and distributed on a schedule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {scheduledReports.map((report) => (
            <Card key={report.id} className="hover:shadow-sm transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-medium">{report.title}</CardTitle>
                    <CardDescription className="text-sm">{report.description}</CardDescription>
                  </div>
                  <Badge variant={report.active ? 'default' : 'outline'}>
                    {report.active ? 'Active' : 'Paused'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      <span className="font-medium">Frequency:</span> {report.frequency}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      <span className="font-medium">Next run:</span> {report.nextRun}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      <span className="font-medium">Time:</span> {report.time}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 text-sm">
                  <span className="font-medium">Recipients:</span>{' '}
                  {report.recipients.join(', ')}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <span className="text-xs text-gray-500">ID: {report.id}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    {report.active ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" /> Activate
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
