import { Users } from 'lucide-react';

function ClientsPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <p className="mt-1 text-sm text-gray-600">Manage your client relationships and onboarding</p>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Management Coming Soon</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            We're building a comprehensive client management system that will help you track client relationships, 
            manage onboarding, and monitor financial plans.
          </p>
          <div className="mt-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
              Stay tuned for updates!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientsPage;