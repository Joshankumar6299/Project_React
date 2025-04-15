import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import { toast } from 'react-toastify';
import axios from '../config/axios';
import Profile from "./Profile";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend, PointElement, LineElement);

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [donations, setDonations] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  
  const [statistics, setStatistics] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [foodTypeFilter, setFoodTypeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [donationNotes, setDonationNotes] = useState("");
  const [allDonations, setAllDonations] = useState([]);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (user && !isLoading) {
      if (isAdmin) {
        fetchAllDonations();
        fetchDonationStatistics();
      } else {
        fetchUserDonations();
      }
    }
  }, [user, isAdmin, isLoading]);

  useEffect(() => {
    if (isAdmin) {
      let filtered = [...allDonations];
      
      if (statusFilter !== "all") {
        filtered = filtered.filter(donation => donation.status === statusFilter);
      }
      
      if (foodTypeFilter !== "all") {
        filtered = filtered.filter(donation => donation.foodType === foodTypeFilter);
      }
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        filtered = filtered.filter(donation => {
          const donationDate = new Date(donation.donationDate);
          return donationDate >= start && donationDate <= end;
        });
      }
      
      setFilteredDonations(filtered);
    } else {
      setFilteredDonations(donations);
    }
  }, [allDonations, statusFilter, foodTypeFilter, startDate, endDate, isAdmin, donations]);

  const fetchDonationStatistics = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/donate/statistics');
      if (response.data && response.data.success) {
        setStatistics(response.data.data);
        console.log("Statistics data loaded:", response.data.data);
      }
    } catch (error) {
      console.error('Error fetching donation statistics:', error);
      
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || `Server error (${statusCode})`;
        
        if (statusCode === 403) {
          toast.error("You don't have permission to view donation statistics");
        } else {
          toast.error(`Failed to fetch statistics: ${errorMessage}`);
        }
      } else if (error.request) {
        toast.error("Network error: Failed to connect to the server");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllDonations = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/donate/all');
      if (response.data && response.data.success) {
        setAllDonations(response.data.data || []);
        console.log(`Admin: Loaded ${response.data.data.length} total donations`);
      }
    } catch (error) {
      console.error('Error fetching all donations:', error);
      
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || `Server error (${statusCode})`;
        
        if (statusCode === 403) {
          toast.error("You don't have permission to view all donations");
        } else {
          toast.error(`Failed to fetch donations: ${errorMessage}`);
        }
      } else if (error.request) {
        toast.error("Network error: Failed to connect to the server");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDonations = async () => {
    try {
      console.log('Attempting to fetch donations from /donate/user');
      const response = await axios.get('/donate/user');
      console.log('Donation response received:', response);
      
      if (response.data && response.data.success) {
        // Ensure that response.data.data is always an array
        const donationsData = Array.isArray(response.data.data) ? response.data.data : [];
        console.log('Setting donations state with:', donationsData.length, 'donations');
        setDonations(donationsData);
      } else {
        console.warn('Response success flag is false or missing:', response.data);
        toast.warning('Received an invalid response format from the server');
        // Initialize as empty array to prevent filter errors
        setDonations([]);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      
      // Initialize as empty array to prevent filter errors
      setDonations([]);
      
      if (error.response) {
        console.error('Server response error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        const errorMessage = error.response.data?.message || `Server error (${error.response.status})`;
        toast.error(`Failed to fetch donations: ${errorMessage}`);
      } else if (error.request) {
        console.error('Network error - No response received:', error.request);
        toast.error('Failed to fetch donations: Network error, server not responding');
      } else {
        console.error('Request setup error:', error.message);
        toast.error(`Failed to fetch donations: ${error.message}`);
      }
    }
  };

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

  const getDonationDetails = async (donationId) => {
    try {
      const response = await axios.get(`/donate/id/${donationId}`);
      if (response.data && response.data.success) {
        setSelectedDonation(response.data.data);
        setDonationNotes(response.data.data.notes || "");
      }
    } catch (error) {
      console.error('Error fetching donation details:', error);
      toast.error("Failed to fetch donation details");
    }
  };

  const addNotesToDonation = async () => {
    if (!selectedDonation) return;
    
    try {
      const response = await axios.post('/donate/add-notes', {
        donationId: selectedDonation._id,
        notes: donationNotes
      });
      
      if (response.data && response.data.success) {
        toast.success("Notes added successfully");
        
        const updatedDonation = response.data.data;
        setAllDonations(prev => prev.map(donation => 
          donation._id === updatedDonation._id ? updatedDonation : donation
        ));
        
        setSelectedDonation(null);
        setDonationNotes("");
        
        if (isAdmin) {
          fetchAllDonations();
        }
      }
    } catch (error) {
      console.error('Error adding notes to donation:', error);
      toast.error("Failed to add notes to donation");
    }
  };

  const updateStatus = async () => {
    if (!selectedDonation || !newStatus) return;
    
    try {
      const response = await axios.patch('/donate/status', {
        donationId: selectedDonation._id,
        status: newStatus
      });
      
      if (response.data && response.data.success) {
        toast.success(`Status updated to ${newStatus}`);
        
        const updatedDonation = response.data.data;
        setAllDonations(prev => prev.map(donation => 
          donation._id === updatedDonation._id ? updatedDonation : donation
        ));
        
        setSelectedDonation(updatedDonation);
        setEditingStatus(false);
        
        if (isAdmin) {
          fetchDonationStatistics();
        }
      }
    } catch (error) {
      console.error('Error updating donation status:', error);
      toast.error("Failed to update donation status");
    }
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setFoodTypeFilter("all");
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        console.log("Dashboard - Token found:", !!token);
        
        if (!token) {
          console.log("Dashboard - No token found, redirecting to login");
          toast.error("Authentication required. Please login.");
          navigate('/login', { state: { from: '/dashboard' } });
          return;
        }
        
        if (token.trim() === '') {
          console.error("Dashboard - Empty token found");
          localStorage.removeItem('accessToken');
          toast.error("Invalid authentication. Please login again.");
          navigate('/login', { state: { from: '/dashboard' } });
          return;
        }
        
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
          
          await Promise.all([
            fetchUserProfile(userData._id)
          ]);
          
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

  const generateFoodTypeChart = () => {
    if (isAdmin && statistics && statistics.byFoodType) {
      return {
        labels: Object.keys(statistics.byFoodType).map(type => 
          type.charAt(0).toUpperCase() + type.slice(1)
        ),
        datasets: [
          {
            data: Object.values(statistics.byFoodType),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
          },
        ],
      };
    }
    
    const foodTypes = {};
    (isAdmin ? filteredDonations : donations).forEach(donation => {
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

  const generateStatusChart = () => {
    if (isAdmin && statistics && statistics.byStatus) {
      return {
        labels: Object.keys(statistics.byStatus).map(status => 
          status.charAt(0).toUpperCase() + status.slice(1)
        ),
        datasets: [
          {
            label: "Donation Status",
            data: Object.values(statistics.byStatus),
            backgroundColor: ["#FFA500", "#36A2EB", "#4BC0C0", "#FF6384"],
          },
        ],
      };
    }
    
    const statusCounts = {
      pending: 0,
      accepted: 0,
      completed: 0,
      cancelled: 0
    };

    (isAdmin ? filteredDonations : donations).forEach(donation => {
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
  
  const generateRecentDonationsChart = () => {
    if (isAdmin && statistics && statistics.recentDonations) {
      const labels = statistics.recentDonations.map(item => item.date);
      const data = statistics.recentDonations.map(item => item.count);
      
      return {
        labels,
        datasets: [
          {
            label: "Daily Donations",
            data,
            borderColor: "#4BC0C0",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.4,
          },
        ],
      };
    }
    
    return {
      labels: ["No data available"],
      datasets: [{ data: [0] }]
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
    
    setTimeout(() => {
      window.location.replace('/');
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }
  
  const DonationDetailView = () => {
    if (!selectedDonation) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Donation Details</h2>
              <button 
                onClick={() => {
                  setSelectedDonation(null);
                  setDonationNotes("");
                  setEditingStatus(false);
                }}
                className="text-gray-500 hover:text-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Donor Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{selectedDonation.fullname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedDonation.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedDonation.phone}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Donation Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{new Date(selectedDonation.donationDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Food Type</p>
                    <p className="font-medium capitalize">{selectedDonation.foodType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-medium">{selectedDonation.foodQuantity} {parseInt(selectedDonation.foodQuantity) > 1 ? 'items' : 'item'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    {editingStatus ? (
                      <div className="flex items-center space-x-2 mt-1">
                        <select 
                          value={newStatus} 
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                        >
                          <option value="">Select status</option>
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                          onClick={updateStatus} 
                          className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingStatus(false)} 
                          className="bg-gray-300 text-gray-800 px-2 py-1 rounded-md text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          selectedDonation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          selectedDonation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          selectedDonation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedDonation.status}
                        </span>
                        {isAdmin && (
                          <button 
                            onClick={() => {
                              setEditingStatus(true);
                              setNewStatus(selectedDonation.status);
                            }}
                            className="text-blue-500 text-sm underline"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p className="p-3 bg-gray-50 rounded-md">{selectedDonation.fullAddress}</p>
            </div>
            
            {isAdmin && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <textarea 
                  value={donationNotes} 
                  onChange={(e) => setDonationNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 h-32"
                  placeholder="Add notes about this donation..."
                />
                <button 
                  onClick={addNotesToDonation}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Save Notes
                </button>
              </div>
            )}
            
            {!isAdmin && selectedDonation.notes && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Notes from Admin</h3>
                <p className="p-3 bg-blue-50 rounded-md italic">{selectedDonation.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {selectedDonation && <DonationDetailView />}
      
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
              ...(isAdmin ? ["Donation Management", "Statistics"] : []), 
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

      <div className="flex-grow bg-gray-100 overflow-y-auto">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">{activePage}</h2>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            </div>
          </div>
        </header>

        <div className="p-6">
          {activePage === "Dashboard" && (
            <>
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
              
              {isAdmin ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-bold">Total Donations</h3>
                    <p className="text-2xl font-bold">{statistics?.totalDonations || allDonations.length}</p>
                  </div>
                  <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-bold">Pending</h3>
                    <p className="text-2xl font-bold">{statistics?.byStatus?.pending || allDonations.filter(d => d.status === 'pending').length}</p>
                  </div>
                  <div className="bg-green-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-bold">Accepted</h3>
                    <p className="text-2xl font-bold">{statistics?.byStatus?.accepted || allDonations.filter(d => d.status === 'accepted').length}</p>
                  </div>
                  <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-bold">Completed</h3>
                    <p className="text-2xl font-bold">{statistics?.byStatus?.completed || allDonations.filter(d => d.status === 'completed').length}</p>
                  </div>
                </div>
              ) : (
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
              )}

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
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(isAdmin ? filteredDonations : donations).length > 0 ? (
                        (isAdmin ? filteredDonations : donations).slice(0, 5).map((donation) => (
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
                            <td className="px-4 py-2">
                              <button
                                onClick={() => getDonationDetails(donation._id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                            No donations found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4">Food Type Distribution</h3>
                  <div className="h-64">
                    {(isAdmin ? filteredDonations : donations).length > 0 ? (
                      <Pie data={generateFoodTypeChart()} options={{ maintainAspectRatio: false }} />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        No donation data available
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4">Donation Status</h3>
                  <div className="h-64">
                    {(isAdmin ? filteredDonations : donations).length > 0 ? (
                      <Bar data={generateStatusChart()} options={{ maintainAspectRatio: false }} />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        No donation data available
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {isAdmin && statistics && statistics.recentDonations && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                  <h3 className="text-lg font-bold mb-4">Donation Trend (Last 7 Days)</h3>
                  <div className="h-64">
                    <Line data={generateRecentDonationsChart()} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>
              )}
            </>
          )}
          
          {activePage === "Donation Management" && isAdmin && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Filter Donations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      value={statusFilter} 
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
                    <select 
                      value={foodTypeFilter} 
                      onChange={(e) => setFoodTypeFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="all">All Food Types</option>
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-Vegetarian</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 space-x-3">
                  <button 
                    onClick={resetFilters}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Donation List</h3>
                  <span className="text-sm text-gray-500">
                    Showing {filteredDonations.length} donations
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Donor</th>
                        <th className="px-4 py-2 text-left">Food Type</th>
                        <th className="px-4 py-2 text-left">Quantity</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonations.length > 0 ? (
                        filteredDonations.map((donation) => (
                          <tr key={donation._id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">
                              {new Date(donation.donationDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">{donation.fullname}</td>
                            <td className="px-4 py-3 capitalize">{donation.foodType}</td>
                            <td className="px-4 py-3">{donation.foodQuantity}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-sm ${
                                donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                donation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                donation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {donation.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => getDonationDetails(donation._id)}
                                className="text-blue-600 hover:text-blue-800 mr-3"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-3 text-center text-gray-500">
                            No donations match your filters
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activePage === "Statistics" && isAdmin && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                  <div className="text-4xl font-bold text-blue-600">
                    {statistics?.totalDonations || 0}
                  </div>
                  <p className="text-gray-600 mt-1">Total Donations</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                  <div className="text-4xl font-bold text-green-600">
                    {statistics?.byStatus?.completed || 0}
                  </div>
                  <p className="text-gray-600 mt-1">Completed</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                  <div className="text-4xl font-bold text-yellow-600">
                    {statistics?.byStatus?.pending || 0}
                  </div>
                  <p className="text-gray-600 mt-1">Pending</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                  <div className="text-4xl font-bold text-red-600">
                    {statistics?.byStatus?.cancelled || 0}
                  </div>
                  <p className="text-gray-600 mt-1">Cancelled</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4">Donation Status Distribution</h3>
                  <div className="h-64">
                    {statistics ? (
                      <Bar 
                        data={generateStatusChart()} 
                        options={{ 
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }} 
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        Loading statistics...
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4">Food Type Distribution</h3>
                  <div className="h-64">
                    {statistics ? (
                      <Pie 
                        data={generateFoodTypeChart()} 
                        options={{ 
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }} 
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        Loading statistics...
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-4">Donation Trend (Last 7 Days)</h3>
                <div className="h-80">
                  {statistics?.recentDonations ? (
                    <Line 
                      data={generateRecentDonationsChart()} 
                      options={{ 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }} 
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      Loading statistics...
                    </div>
                  )}
                </div>
              </div>
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