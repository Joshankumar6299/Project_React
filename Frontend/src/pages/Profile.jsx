import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [activeNav, setActiveNav] = useState('profile');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userDonations, setUserDonations] = useState([]);
  const [isLoadingDonations, setIsLoadingDonations] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pinCode: ''
  });

  // Get user data from local storage
  const getUserFromStorage = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return {};
    }
  };

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const user = getUserFromStorage();
    if (user && user._id) {
      setFormData(prevData => ({
        ...prevData,
        fullName: user.fullname || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        pinCode: user.pincode || ''
      }));
    }
  }, []);

  // Fetch user donations when the "donations" tab is active
  useEffect(() => {
    if (activeNav === 'donations') {
      fetchUserDonations();
    }
  }, [activeNav]);

  // Fetch user donations from the API
  const fetchUserDonations = async () => {
    const user = getUserFromStorage();
    if (!user || !user._id) {
      toast.error('User information not available');
      return;
    }

    setIsLoadingDonations(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Authentication required');
        navigate('/login', { state: { from: '/dashboard' } });
        return;
      }

      // Add proper error handling
      try {
        const response = await axios.get('/donate/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('User donations fetched:', response.data);
        setUserDonations(response.data.data || []);
      } catch (apiError) {
        console.error('API Error:', apiError);
        
        // Check for authentication errors
        if (apiError.response?.status === 401) {
          toast.error('Your login session has expired. Please log in again.');
          // Clear invalid token
          localStorage.removeItem('accessToken');
          setTimeout(() => navigate('/login', { state: { from: '/dashboard' } }), 2000);
        } else {
          toast.error('Failed to load your donations. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error in donation fetch process:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoadingDonations(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number
    if (name === 'phone') {
      // Only allow digits, and limit to 10 digits
      const digitsOnly = value.replace(/\D/g, '');
      const truncated = digitsOnly.slice(0, 10);
      
      if (value !== truncated && value.length > truncated.length) {
        setPhoneError('Please enter only 10 digits');
      } else {
        setPhoneError('');
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: truncated
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number
    if (formData.phone && formData.phone.length !== 10) {
      setPhoneError('Phone number must be 10 digits');
      return;
    }

    setIsLoading(true);
    
    try {
      const user = getUserFromStorage();
      const token = localStorage.getItem('accessToken');
      
      if (!user._id || !token) {
        toast.error('Authentication required');
        navigate('/login', { state: { from: '/dashboard' } });
        return;
      }
      
      // Prepare the data to update
      const updateData = {
        fullname: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pinCode
      };
      
      // Make API call to update user profile with better error handling
      try {
        const response = await axios.put(`/user/update/${user._id}`, updateData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Profile update response:', response.data);
        
        // Update the local storage with new user data
        const updatedUser = {
          ...user,
          fullname: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pinCode
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } catch (apiError) {
        console.error('API Error during profile update:', apiError);
        
        // Handle authentication errors
        if (apiError.response?.status === 401) {
          toast.error('Your login session has expired. Please log in again.');
          localStorage.removeItem('accessToken');
          setTimeout(() => navigate('/login', { state: { from: '/dashboard' } }), 2000);
        } else {
          toast.error(apiError.response?.data?.message || 'Failed to update profile');
        }
      }
    } catch (error) {
      console.error('Unexpected error in profile update:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return; // First click just shows the confirmation
    }
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Authentication required');
        navigate('/login', { state: { from: '/dashboard' } });
        return;
      }
      
      // Make API call to delete user account with better error handling
      try {
        await axios.delete('/user/delete', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Clear all local storage data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        toast.success('Your account has been deleted successfully');
        
        // Redirect to home page
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (apiError) {
        console.error('API Error during account deletion:', apiError);
        
        // Handle authentication errors
        if (apiError.response?.status === 401) {
          toast.error('Your login session has expired. Please log in again.');
          localStorage.removeItem('accessToken');
          setTimeout(() => navigate('/login', { state: { from: '/dashboard' } }), 2000);
          setIsDeleting(false);
        } else {
          toast.error(apiError.response?.data?.message || 'Failed to delete account');
          setIsDeleting(false);
        }
      }
    } catch (error) {
      console.error('Unexpected error in account deletion:', error);
      toast.error('An unexpected error occurred. Please try again.');
      setIsDeleting(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Format donation date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Determine badge color based on donation status
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render user's profile information
  const renderProfileInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <h3 className="text-sm text-gray-500 font-medium">Full Name</h3>
        <p className="text-lg">{formData.fullName || 'Not provided'}</p>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm text-gray-500 font-medium">Email</h3>
        <p className="text-lg">{formData.email || 'Not provided'}</p>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm text-gray-500 font-medium">Phone</h3>
        <p className="text-lg">{formData.phone || 'Not provided'}</p>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm text-gray-500 font-medium">Address</h3>
        <p className="text-lg">{formData.address || 'Not provided'}</p>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm text-gray-500 font-medium">City</h3>
        <p className="text-lg">{formData.city || 'Not provided'}</p>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm text-gray-500 font-medium">Pin Code</h3>
        <p className="text-lg">{formData.pinCode || 'Not provided'}</p>
      </div>
    </div>
  );

  // Render user's donation history
  const renderDonations = () => {
    if (isLoadingDonations) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (userDonations.length === 0) {
      return (
        <div className="text-center py-10">
          <div className="text-5xl mb-4">🍽️</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No donations yet</h3>
          <p className="text-gray-500 mb-6">You haven't made any food donations yet.</p>
          <Link
            to="/donate"
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Make Your First Donation
          </Link>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userDonations.map((donation) => (
              <tr key={donation._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(donation.donationDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{donation.foodType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{donation.foodQuantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(donation.status)}`}>
                    {donation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => {/* View details functionality */}}
                  >
                    View
                  </button>
                  {donation.status === 'pending' && (
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {/* Cancel donation functionality */}}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Render account settings
  const renderSettings = () => (
    <div className="space-y-8">
      <div className="border-b pb-6">
        <h3 className="text-lg font-medium mb-4">Account Security</h3>
        <div className="space-y-4">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={() => toast.info('Password change feature coming soon!')}
          >
            Change Password
          </button>
        </div>
      </div>
      
      <div className="border-b pb-6">
        <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="donationUpdates" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              defaultChecked
            />
            <label htmlFor="donationUpdates" className="ml-2 block text-sm text-gray-900">
              Donation status updates
            </label>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="newCampaigns" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              defaultChecked
            />
            <label htmlFor="newCampaigns" className="ml-2 block text-sm text-gray-900">
              New donation campaigns
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h4 className="text-red-800 font-medium mb-2">Delete Account</h4>
          <p className="text-sm text-red-700 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          {isDeleting ? (
            <div className="space-y-3">
              <p className="text-sm font-bold text-red-700">Are you absolutely sure? This action cannot be undone.</p>
              <div className="flex space-x-3">
                <button 
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  onClick={handleDeleteAccount}
                >
                  Yes, delete my account
                </button>
                <button 
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                  onClick={() => setIsDeleting(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="bg-white text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-50 transition-colors"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Navigation Bar */}
      <div className="bg-white shadow-md mb-6 rounded-lg overflow-hidden">
        <div className="container mx-auto">
          <nav className="flex flex-wrap">
            <button 
              onClick={() => setActiveNav('profile')}
              className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${
                activeNav === 'profile' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              Profile
            </button>
            <button 
              onClick={() => setActiveNav('donations')}
              className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${
                activeNav === 'donations' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              My Donations
            </button>
            <button 
              onClick={() => setActiveNav('settings')}
              className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${
                activeNav === 'settings' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              Settings
            </button>
            <Link 
              to="/donate" 
              className="ml-auto px-6 py-3 my-1 mr-2 bg-green-500 text-white rounded-md font-medium text-sm hover:bg-green-600 transition-colors duration-200"
            >
              Donate Now
            </Link>
          </nav>
        </div>
      </div>

      {activeNav === 'profile' && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                {/* Profile image or initials could go here */}
                <span className="text-4xl font-bold text-gray-600">
                  {formData.fullName.charAt(0) || '?'}
                </span>
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold">{formData.fullName || 'User'}</h2>
                <p className="text-gray-600">{formData.email || 'No email provided'}</p>
              </div>
            </div>
            <button 
              className={`text-white px-6 py-2 rounded-md flex items-center justify-center ${isEditing ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'}`}
              onClick={toggleEdit}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="relative z-0 w-full group">
                  <input 
                    type="text" 
                    name="fullName" 
                    className="outline-none block w-full px-0 py-2.5 text-sm bg-transparent border-b-2 border-gray-300 appearance-none focus:border-blue-600 peer" 
                    placeholder=" " 
                    value={formData.fullName}
                    onChange={handleChange}
                    required 
                  />
                  <label 
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Full Name
                  </label>
                </div>

                <div className="relative z-0 w-full group">
                  <input 
                    type="email" 
                    name="email" 
                    className="outline-none block w-full px-0 py-2.5 text-sm bg-transparent border-b-2 border-gray-300 appearance-none focus:border-blue-600 peer" 
                    placeholder=" " 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                  <label 
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Email
                  </label>
                </div>

                <div className="relative z-0 w-full group">
                  <input 
                    type="tel" 
                    name="phone" 
                    className="outline-none block w-full px-0 py-2.5 text-sm bg-transparent border-b-2 border-gray-300 appearance-none focus:border-blue-600 peer" 
                    placeholder=" " 
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength="10" 
                  />
                  <label 
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Phone (10 digits)
                  </label>
                  {phoneError && (
                    <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                  )}
                </div>

                <div className="relative z-0 w-full group">
                  <input 
                    type="text" 
                    name="address" 
                    className="outline-none block w-full px-0 py-2.5 text-sm bg-transparent border-b-2 border-gray-300 appearance-none focus:border-blue-600 peer" 
                    placeholder=" " 
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <label 
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Address
                  </label>
                </div>

                <div className="relative z-0 w-full group">
                  <input 
                    type="text" 
                    name="city" 
                    className="outline-none block w-full px-0 py-2.5 text-sm bg-transparent border-b-2 border-gray-300 appearance-none focus:border-blue-600 peer" 
                    placeholder=" " 
                    value={formData.city}
                    onChange={handleChange}
                  />
                  <label 
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    City
                  </label>
                </div>

                <div className="relative z-0 w-full group">
                  <input 
                    type="text" 
                    name="pinCode" 
                    className="outline-none block w-full px-0 py-2.5 text-sm bg-transparent border-b-2 border-gray-300 appearance-none focus:border-blue-600 peer" 
                    placeholder=" " 
                    value={formData.pinCode}
                    onChange={handleChange}
                  />
                  <label 
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Pin Code
                  </label>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  type="button"
                  className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={toggleEdit}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          ) : (
            renderProfileInfo()
          )}
        </div>
      )}
      
      {activeNav === 'donations' && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full">
          <h2 className="text-2xl font-bold mb-6">My Donations</h2>
          {renderDonations()}
        </div>
      )}
      
      {activeNav === 'settings' && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full">
          <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
          {renderSettings()}
        </div>
      )}
    </div>
  );
};

export default Profile;