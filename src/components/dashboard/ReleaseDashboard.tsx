import { DashboardHeader } from "./DashboardHeader";
import { ReleaseManagement } from "./ReleaseManagement";
import { ApprovalStatus } from "./ApprovalStatus";
import { PipelineOverview } from "./PipelineOverview";
import { TestStatus } from "./TestStatus";
import { AlertsPanel } from "./AlertsPanel";
import { ReleaseWorkflow } from "./ReleaseWorkflow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockUser = {
  name: "Sarah Connor",
  role: "Release Manager",
  avatar: ""
};

export function ReleaseDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={mockUser} />
      
      <div className="container py-6">
        <Tabs defaultValue="pre-release" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pre-release">Pre-release</TabsTrigger>
            <TabsTrigger value="release">Release</TabsTrigger>
          </TabsList>

          <TabsContent value="pre-release" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReleaseManagement />
              <ApprovalStatus />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PipelineOverview />
              <TestStatus />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AlertsPanel />
            </div>
          </TabsContent>

          <TabsContent value="release" className="space-y-6">
            <ReleaseWorkflow />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}