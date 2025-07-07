import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

function AdvisorProfile() {
  const { user, checkAuthStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      firmName: user?.firmName || '',
      phoneNumber: user?.phoneNumber || '',
      sebiRegNumber: user?.sebiRegNumber || '',
      revenueModel: user?.revenueModel || '',
      fpsbNumber: user?.fpsbNumber || '',
      riaNumber: user?.riaNumber || '',
      arnNumber: user?.arnNumber || '',
      amfiRegNumber: user?.amfiRegNumber || ''
    }
  });

  useEffect(() => {
    // Reset form when user data is loaded
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        firmName: user.firmName || '',
        phoneNumber: user.phoneNumber || '',
        sebiRegNumber: user.sebiRegNumber || '',
        revenueModel: user.revenueModel || '',
        fpsbNumber: user.fpsbNumber || '',
        riaNumber: user.riaNumber || '',
        arnNumber: user.arnNumber || '',
        amfiRegNumber: user.amfiRegNumber || ''
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.updateProfile(data);
      if (response.success) {
        toast.success('Profile updated successfully!');
        // Refresh user data
        await checkAuthStatus();
        reset(data);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile Information</h1>
        <p className="mt-1 text-sm text-gray-600">Update your profile information and professional credentials</p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Firm Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firmName" className="block text-sm font-medium text-gray-700 mb-1">
                Firm Name
              </label>
              <input
                id="firmName"
                type="text"
                {...register('firmName')}
                placeholder="Enter your firm name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone and SEBI Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                {...register('phoneNumber')}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="sebiRegNumber" className="block text-sm font-medium text-gray-700 mb-1">
                SEBI Registration Number
              </label>
              <input
                id="sebiRegNumber"
                type="text"
                {...register('sebiRegNumber')}
                placeholder="INH000012345"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Revenue Model and FPSB Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="revenueModel" className="block text-sm font-medium text-gray-700 mb-1">
                Revenue Model
              </label>
              <select
                id="revenueModel"
                {...register('revenueModel')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select revenue model</option>
                <option value="Fee-Only">Fee-Only</option>
                <option value="Commission-Based">Commission-Based</option>
                <option value="Fee + Commission">Fee + Commission</option>
              </select>
            </div>

            <div>
              <label htmlFor="fpsbNumber" className="block text-sm font-medium text-gray-700 mb-1">
                FPSB Number (Optional)
              </label>
              <input
                id="fpsbNumber"
                type="text"
                {...register('fpsbNumber')}
                placeholder="Enter FPSB certification number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">Financial Planning Standards Board certification</p>
            </div>
          </div>

          {/* RIA and ARN Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="riaNumber" className="block text-sm font-medium text-gray-700 mb-1">
                RIA Number (Optional)
              </label>
              <input
                id="riaNumber"
                type="text"
                {...register('riaNumber')}
                placeholder="Enter RIA registration number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">Registered Investment Advisor number</p>
            </div>

            <div>
              <label htmlFor="arnNumber" className="block text-sm font-medium text-gray-700 mb-1">
                ARN Number (Optional)
              </label>
              <input
                id="arnNumber"
                type="text"
                {...register('arnNumber')}
                placeholder="Enter ARN code"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* AMFI Registration */}
          <div>
            <label htmlFor="amfiRegNumber" className="block text-sm font-medium text-gray-700 mb-1">
              AMFI Registration Number for mutual fund distribution
            </label>
            <input
              id="amfiRegNumber"
              type="text"
              {...register('amfiRegNumber')}
              placeholder="Enter AMFI registration number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !isDirty}
              className="px-6 py-2.5 bg-[#1e3a5f] text-white font-medium rounded-lg hover:bg-[#2a4a7f] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdvisorProfile;