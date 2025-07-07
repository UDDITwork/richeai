import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
                <h1 className="text-lg font-semibold text-gray-800 tracking-wide">Richie</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, {user?.firstName} {user?.lastName}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Your Dashboard
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Hello {user?.firstName}! You have successfully logged in to your RICHIEAT advisor account.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Account Information
              </h3>
              <div className="text-left space-y-2">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Name:</span> {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Status:</span> 
                  <span className="ml-2 px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                    {user?.status || 'Active'}
                  </span>
                </p>
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Member Since:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Coming Soon
              </h3>
              <p className="text-sm text-yellow-800">
                Dashboard features like client management, portfolio tracking, and analytics will be available soon.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;