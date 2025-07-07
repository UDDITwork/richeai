import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import ClientList from './client/ClientList';
import AddClientModal from './modals/AddClientModal';
import { clientAPI } from '../services/api';
import toast from 'react-hot-toast';

function ClientsPage() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    pendingInvitations: 0,
    completedOnboarding: 0
  });
  const [recentInvitations, setRecentInvitations] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Load dashboard stats
  const loadStats = async () => {
    try {
      setLoadingStats(true);
      
      // Load clients and invitations in parallel
      const [clientsResponse, invitationsResponse] = await Promise.all([
        clientAPI.getClients({ limit: 100 }), // Get more to calculate stats
        clientAPI.getInvitations({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' })
      ]);

      const clients = clientsResponse.data.clients;
      const invitations = invitationsResponse.data.invitations;

      // Calculate stats
      const totalClients = clients.length;
      const activeClients = clients.filter(c => c.status === 'active').length;
      const onboardingClients = clients.filter(c => c.status === 'onboarding').length;
      const pendingInvitations = invitations.filter(i => 
        ['pending', 'sent', 'opened'].includes(i.status)
      ).length;

      setStats({
        totalClients,
        activeClients,
        pendingInvitations,
        completedOnboarding: onboardingClients
      });

      setRecentInvitations(invitations);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  const handleClientAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success('Client invitation sent successfully!');
  };

  const handleEdit = (clientId) => {
    toast.info('Client editing feature coming soon!');
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        await clientAPI.deleteClient(clientId);
        toast.success('Client deleted successfully');
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Failed to delete client:', error);
        toast.error('Failed to delete client');
      }
    }
  };

  const handleView = (clientId) => {
    navigate(`/clients/${clientId}`);
  };

  const getInvitationStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'opened':
        return 'text-blue-600 bg-blue-100';
      case 'sent':
        return 'text-orange-600 bg-orange-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return past.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your client relationships, send invitations, and track onboarding progress
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Client
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Clients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">
                {loadingStats ? '-' : stats.totalClients}
              </p>
            </div>
          </div>
        </div>

        {/* Active Clients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">
                {loadingStats ? '-' : stats.activeClients}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Invitations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Mail className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Invitations</p>
              <p className="text-2xl font-bold text-gray-900">
                {loadingStats ? '-' : stats.pendingInvitations}
              </p>
            </div>
          </div>
        </div>

        {/* Onboarding */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Onboarding</p>
              <p className="text-2xl font-bold text-gray-900">
                {loadingStats ? '-' : stats.completedOnboarding}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Client List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Recent Invitations */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Invitations</h3>
            
            {recentInvitations.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No invitations yet</p>
                <p className="text-xs text-gray-500 mt-1">Start by adding your first client</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentInvitations.map((invitation) => (
                  <div key={invitation._id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {invitation.clientFirstName 
                            ? `${invitation.clientFirstName} ${invitation.clientLastName || ''}`.trim()
                            : invitation.clientEmail
                          }
                        </p>
                        <p className="text-xs text-gray-600 truncate">{invitation.clientEmail}</p>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getInvitationStatusColor(invitation.status)}`}>
                            {invitation.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 ml-2">
                        {formatTimeAgo(invitation.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {recentInvitations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  View All Invitations
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Client List */}
        <div className="lg:col-span-3">
          <ClientList
            refreshTrigger={refreshTrigger}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>
      </div>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
}

export default ClientsPage;