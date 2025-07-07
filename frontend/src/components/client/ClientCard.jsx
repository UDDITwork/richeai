import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  Target, 
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  Clock
} from 'lucide-react';

function ClientCard({ client, onEdit, onDelete, onView }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'onboarding':
        return 'bg-blue-100 text-blue-800';
      case 'invited':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Conservative':
        return 'text-blue-600';
      case 'Moderate':
        return 'text-green-600';
      case 'Aggressive':
        return 'text-orange-600';
      case 'Very Aggressive':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Not provided';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-full mr-3">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {client.fullName || `${client.firstName} ${client.lastName}`}
            </h3>
            <p className="text-sm text-gray-600">{client.email}</p>
          </div>
        </div>
        
        {/* Status and Actions */}
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
            {client.status}
          </span>
          
          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onView(client._id);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      onEdit(client._id);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Client
                  </button>
                  <button
                    onClick={() => {
                      onDelete(client._id);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Client
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Client Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Contact Info */}
        <div>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Mail className="h-4 w-4 mr-2" />
            <span className="truncate">{client.email}</span>
          </div>
          {client.phoneNumber && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Phone className="h-4 w-4 mr-2" />
              <span>{client.phoneNumber}</span>
            </div>
          )}
          {client.dateOfBirth && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(client.dateOfBirth)}</span>
            </div>
          )}
        </div>

        {/* Financial Info */}
        <div>
          {client.annualIncome && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>{formatCurrency(client.annualIncome)}</span>
            </div>
          )}
          {client.riskTolerance && (
            <div className="flex items-center text-sm mb-2">
              <Target className="h-4 w-4 mr-2 text-gray-400" />
              <span className={`font-medium ${getRiskColor(client.riskTolerance)}`}>
                {client.riskTolerance}
              </span>
            </div>
          )}
          {client.investmentExperience && (
            <div className="text-sm text-gray-600">
              Experience: {client.investmentExperience}
            </div>
          )}
        </div>
      </div>

      {/* Investment Goals */}
      {client.investmentGoals && client.investmentGoals.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Investment Goals</h4>
          <div className="flex flex-wrap gap-1">
            {client.investmentGoals.slice(0, 3).map((goal, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded"
              >
                {goal}
              </span>
            ))}
            {client.investmentGoals.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                +{client.investmentGoals.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* KYC Status */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <span className="text-gray-600">KYC Status:</span>
          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
            client.kycStatus === 'completed' 
              ? 'bg-green-100 text-green-800'
              : client.kycStatus === 'in_progress'
              ? 'bg-blue-100 text-blue-800'
              : client.kycStatus === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {client.kycStatus || 'pending'}
          </span>
        </div>
        
        {/* Last Activity */}
        <div className="flex items-center text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatDate(client.lastActiveDate || client.updatedAt)}</span>
        </div>
      </div>

      {/* Notes Preview */}
      {client.notes && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">
            <span className="font-medium">Notes:</span> {client.notes}
          </p>
        </div>
      )}
    </div>
  );
}

export default ClientCard;