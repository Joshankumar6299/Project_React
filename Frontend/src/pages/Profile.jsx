import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [activeNav, setActiveNav] = useState('profile');
  
  const [formData, setFormData] = useState({
    fullName: 'Joshan Kumar Kushwaha',
    phone: '1234567890',
    email: 'example@gmail.com',
    ngoName: 'Yash Foundation',
    address: 'RK University',
    city: 'Rajkot (Gujarat)',
    pinCode: '360020'
  });

  useEffect(() => {
    // Fetch user data from localStorage on component mount
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        fullName: user.name || prevData.fullName,
        email: user.email || prevData.email,
        // Populate other fields if available in user object
      }));
    }
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate phone number
    if (formData.phone.length !== 10) {
      setPhoneError('Phone number must be 10 digits');
      return;
    }
    
    // Here you would make an API call to update the user's profile
    console.log('Updated profile:', formData);
    
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

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

      <div className="bg-white p-8 rounded-lg shadow-md w-full">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              {/* Profile image or initials could go here */}
              <span className="text-4xl font-bold text-gray-600">
                {formData.fullName.charAt(0)}
              </span>
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold">{formData.fullName}</h2>
              <p className="text-gray-600">{formData.ngoName}</p>
            </div>
          </div>
          <button 
            className={`text-white px-6 py-2 rounded-md flex items-center justify-center ${isEditing ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            onClick={toggleEdit}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
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
                  required 
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
                  name="ngoName" 
                  className="outline-none block w-full px-0 py-2.5 text-sm bg-transparent border-b-2 border-gray-300 appearance-none focus:border-blue-600 peer" 
                  placeholder=" " 
                  value={formData.ngoName}
                  onChange={handleChange}
                  required 
                />
                <label 
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  NGO Name
                </label>
              </div>

              <div className="relative z-0 w-full group">
                <input 
                  type="text" 
                  name="address" 
                  className="outline-none block w-full px-0 py-2.5 text-sm bg-transparent border-b-2 border-gray-300 appearance-none focus:border-blue-600 peer" 
                  placeholder=" " 
                  value={formData.address}
                  onChange={handleChange}
                  required 
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
                  required 
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
                  required 
                />
                <label 
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  PinCode
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* About Section - View Mode */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-xl mr-3 text-blue-500">📱</span>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-700">{formData.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-xl mr-3 text-blue-500">📧</span>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-700">{formData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-xl mr-3 text-blue-500">🏢</span>
                  <div>
                    <p className="font-medium">NGO Name</p>
                    <p className="text-gray-700">{formData.ngoName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section - View Mode */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-green-600">Address Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-xl mr-3 text-green-500">📍</span>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-700">{formData.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-xl mr-3 text-green-500">🏙️</span>
                  <div>
                    <p className="font-medium">City</p>
                    <p className="text-gray-700">{formData.city}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-xl mr-3 text-green-500">📮</span>
                  <div>
                    <p className="font-medium">PinCode</p>
                    <p className="text-gray-700">{formData.pinCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;