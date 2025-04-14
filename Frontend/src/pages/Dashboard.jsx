import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from "chart.js";
import { toast } from 'react-toastify';
import axios from '../config/axios';
import Profile from "./Profile";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [donations, setDonations] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  // Fetch user donations
  const fetchDonations = async () => {
    try {
      console.log('Attempting to fetch donations from /donate/user');
      const response = await axios.get('/donate/user');
      console.log('Donation response received:', response);
      
      if (response.data && response.data.success) {
        console.log('Setting donations state with:', response.data.data.length, 'donations');
        setDonations(response.data.data || []);
      } else {
        console.warn('Response success flag is false or missing:', response.data);
        toast.warning('Received an invalid response format from the server');
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      
      // More detailed error information
      if (error.response) {
        // The server responded with a status code outside of 2xx
        console.error('Server response error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        const errorMessage = error.response.data?.message || `Server error (${error.response.status})`;
        toast.error(`Failed to fetch donations: ${errorMessage}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Network error - No response received:', error.request);
        toast.error('Failed to fetch donations: Network error, server not responding');
      } else {
        // Something else caused the error
        console.error('Request setup error:', error.message);
        toast.error(`Failed to fetch donations: ${error.message}`);
      }
    }
  };

  // Fetch user profile including donation records
  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`/user/profile`);
      if (response.data && response.data.success) {
        setUserProfile(response.data.data);
        console.log("User profile loaded with donation data:", response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Check authentication and fetch data on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if the user is authenticated
        const token = localStorage.getItem('accessToken');
        console.log("Dashboard - Token found:", !!token);
        
        if (!token) {
          console.log("Dashboard - No token found, redirecting to login");
          toast.error("Authentication required. Please login.");
          navigate('/login', { state: { from: '/dashboard' } });
          return;
        }
        
        // Verify token is properly formatted
        if (token.trim() === '') {
          console.error("Dashboard - Empty token found");
          localStorage.removeItem('accessToken');
          toast.error("Invalid authentication. Please login again.");
          navigate('/login', { state: { from: '/dashboard' } });
          return;
        }
        
        // Get user data
        try {
          const userString = localStorage.getItem('user');
          if (!userString) {
            console.error("Dashboard - No user data found");
            toast.error("User data not found. Please login again.");
            localStorage.removeItem('accessToken');
            navigate('/login', { state: { from: '/dashboard' } });
            return;
          }
          
          const userData = JSON.parse(userString);
          
          if (!userData || !userData._id) {
            console.error("Dashboard - Invalid user data:", userData);
            toast.error("Invalid user data. Please login again.");
            localStorage.removeItem('accessToken');
            navigate('/login', { state: { from: '/dashboard' } });
            return;
          }
          
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
          console.log("Dashboard - User data loaded:", userData.fullname);
          
          // Fetch user donations and profile data
          await Promise.all([
            fetchDonations(),
            fetchUserProfile(userData._id)
          ]);
          
          // Set loading to false since we have valid token and user data
          setIsLoading(false);
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          toast.error("Error loading user data. Please login again.");
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          navigate('/login', { state: { from: '/dashboard' } });
        }
      } catch (error) {
        console.error("Dashboard - Authentication error:", error);
        toast.error("Authentication error. Please login again.");
        navigate('/login', { state: { from: '/dashboard' } });
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Food Type Distribution Chart
  const generateFoodTypeChart = () => {
    // Count donations by food type
    const foodTypes = {};
    donations.forEach(donation => {
      const type = donation.foodType;
      foodTypes[type] = (foodTypes[type] || 0) + 1;
    });

    return {
      labels: Object.keys(foodTypes).map(type => 
        type.charAt(0).toUpperCase() + type.slice(1)
      ),
      datasets: [
        {
          data: Object.values(foodTypes),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    };
  };

  // Status Distribution Chart
  const generateStatusChart = () => {
    const statusCounts = {
      pending: 0,
      accepted: 0,
      completed: 0,
      cancelled: 0
    };

    donations.forEach(donation => {
      if (statusCounts[donation.status] !== undefined) {
        statusCounts[donation.status]++;
      }
    });

    return {
      labels: Object.keys(statusCounts).map(status => 
        status.charAt(0).toUpperCase() + status.slice(1)
      ),
      datasets: [
        {
          label: "Donation Status",
          data: Object.values(statusCounts),
          backgroundColor: ["#FFA500", "#36A2EB", "#4BC0C0", "#FF6384"],
        },
      ],
    };
  };

  // Handle logout
  const handleLogout = () => {
    // Clear all tokens and user data from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Show logout success message
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
    
    // Use replace for a clean navigation
    setTimeout(() => {
      window.location.replace('/');
    }, 1000);
  };

  // Placeholder components for Total User and Total Donor
  const TotalUser = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Total Users</h2>
      <p className="text-gray-600">
        This is a placeholder for the Total User component. The actual component will be implemented later.
      </p>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">User Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-500">Total Registered</p>
            <p className="text-xl font-bold">1,245</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-xl font-bold">987</p>
          </div>
        </div>
      </div>
    </div>
  );

  const TotalDonor = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Total Donors</h2>
      <p className="text-gray-600">
        This is a placeholder for the Total Donor component. The actual component will be implemented later.
      </p>
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Donor Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-500">Total Donors</p>
            <p className="text-xl font-bold">568</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-500">Active Donors</p>
            <p className="text-xl font-bold">432</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-blue-700 text-white flex flex-col">
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold">Food Donate</h1>
          <h1 className="mt-2">Welcome {isAdmin ? 'Admin' : user?.fullname || 'User'}</h1>
          {userProfile && (
            <div className="mt-2 bg-blue-800 rounded-md p-2 text-center">
              <p className="text-sm">Total Donations: {userProfile.totalDonations || 0}</p>
            </div>
          )}
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 px-4">
            {[
              "Dashboard", 
              ...(isAdmin ? ["Total User", "Total Donor"] : []), 
              "Profile"
            ].map((page) => (
              <li key={page}>
                <button
                  onClick={() => setActivePage(page)}
                  className={`w-full text-left py-2 px-4 rounded-md ${
                    activePage === page ? "bg-blue-800" : "hover:bg-blue-600"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">{activePage}</h2>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Conditional Rendering Based on Active Page */}
          {activePage === "Dashboard" && (
            <>
              {/* User Stats Section */}
              {userProfile && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                  <h3 className="text-lg font-bold mb-4">Your Donation Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-100 p-4 rounded-lg text-center">
                      <p className="text-sm text-blue-800">Total Donations</p>
                      <p className="text-2xl font-bold text-blue-800">{userProfile.totalDonations || 0}</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg text-center">
                      <p className="text-sm text-green-800">Accepted Donations</p>
                      <p className="text-2xl font-bold text-green-800">
                        {donations.filter(d => d.status === 'accepted').length}
                      </p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg text-center">
                      <p className="text-sm text-yellow-800">Pending Donations</p>
                      <p className="text-2xl font-bold text-yellow-800">
                        {donations.filter(d => d.status === 'pending').length}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-lg text-center">
                      <p className="text-sm text-purple-800">Total Quantity</p>
                      <p className="text-2xl font-bold text-purple-800">
                        {donations.reduce((sum, donation) => sum + parseInt(donation.foodQuantity || 0), 0)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-bold">Total Donations</h3>
                  <p className="text-2xl font-bold">{donations.length}</p>
                </div>
                <div className="bg-green-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-bold">Total Quantity</h3>
                  <p className="text-2xl font-bold">
                    {donations.reduce((sum, donation) => sum + parseInt(donation.foodQuantity || 0), 0)}
                  </p>
                </div>
                <div className="bg-teal-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-bold">Pending Donations</h3>
                  <p className="text-2xl font-bold">
                    {donations.filter(donation => donation.status === 'pending').length}
                  </p>
                </div>
              </div>

              {/* Recent Donations Table */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-bold mb-4">Recent Donations</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Food Type</th>
                        <th className="px-4 py-2 text-left">Quantity</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.length > 0 ? (
                        donations.slice(0, 5).map((donation) => (
                          <tr key={donation._id} className="border-t">
                            <td className="px-4 py-2">
                              {new Date(donation.donationDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2">{donation.foodType}</td>
                            <td className="px-4 py-2">{donation.foodQuantity}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded-full text-sm ${
                                donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                donation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                donation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {donation.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                            No donations found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Food Type Chart */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4">Food Type Distribution</h3>
                  <div className="h-64">
                    {donations.length > 0 ? (
                      <Pie data={generateFoodTypeChart()} options={{ maintainAspectRatio: false }} />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        No donation data available
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Chart */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4">Donation Status</h3>
                  <div className="h-64">
                    {donations.length > 0 ? (
                      <Bar data={generateStatusChart()} options={{ maintainAspectRatio: false }} />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        No donation data available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activePage === "Total User" && (
            <div>
              <TotalUser />
            </div>
          )}

          {activePage === "Total Donor" && (
            <div>
              <TotalDonor />
            </div>
          )}

          {activePage === "Profile" && (
            <div>
              <Profile userProfile={userProfile} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;