import { Plus, Upload, Save, Users, FileText, Calendar, Bell } from 'lucide-react';
import MetricCard from './dashboard/MetricCard';
import ActionCard from './dashboard/ActionCard';

function Dashboard() {
  // Action card handlers
  const handleCreatePlan = () => {
    console.log('Create new plan');
  };

  const handleImportClient = () => {
    console.log('Import client data');
  };

  const handleSavePlan = () => {
    console.log('Save financial plan');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Financial Planner Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Overview of your clients and financial plans</p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ActionCard
          icon={Plus}
          title="Create New Plan"
          description="Start a financial plan for a client"
          buttonText="New Plan"
          onClick={handleCreatePlan}
        />
        <ActionCard
          icon={Upload}
          title="Import Client Data"
          description="Import from CAMS, Karvy, or Excel"
          buttonText="Upload Files"
          onClick={handleImportClient}
        />
        <ActionCard
          icon={Save}
          title="Save Financial Plan"
          description="Save a sample plan for testing"
          buttonText="Save Sample Plan"
          onClick={handleSavePlan}
        />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={Users}
          iconColor="bg-blue-500"
          title="Active Clients"
          value="0"
          trend="0 from last month"
          trendText=""
        />
        <MetricCard
          icon={FileText}
          iconColor="bg-amber-500"
          title="Financial Plans"
          value="0"
          trend="0 from last week"
          trendText=""
        />
        <MetricCard
          icon={Calendar}
          iconColor="bg-purple-500"
          title="Upcoming Reviews"
          value="0"
          trend="+0 this week"
          trendText=""
        />
        <MetricCard
          icon={Bell}
          iconColor="bg-green-500"
          title="Compliance Alerts"
          value="0"
          trend="All clear good standing"
          trendText=""
        />
      </div>

      {/* Plan Generation Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">⚡ Plan Generation</h3>
          <span className="text-sm text-gray-600">5/5 Free</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Plans Generated</span>
            <span className="font-medium text-gray-900">0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Free Plans Used</span>
            <span className="font-medium text-gray-900">0/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;