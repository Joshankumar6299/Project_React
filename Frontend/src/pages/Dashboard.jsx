import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from "chart.js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
// import TotalUser from "./totalUser";
// import TotalDonor from "./totalDonar";
import Profile from "./Profile";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  // Fetch user donations
  const fetchDonations = async () => {
    try {
      const response = await axios.get('/donate/user-donations');
      if (response.data && response.data.success) {
        setDonations(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Failed to fetch donations');
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
          
          // Fetch user donations
          await fetchDonations();
          
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

  // Data for Bar Chart
  const barData = {
    labels: ["2019", "2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "Clients",
        data: [100, 200, 300, 400, 500],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  // Data for Pie Chart
  const pieData = {
    labels: ["Community Food", "Federal Food", "State Dollars", "Northwest Harvest Food"],
    datasets: [
      {
        data: [33, 17, 11, 22],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
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
      <ToastContainer />
      {/* Sidebar */}
      <div className="w-1/4 bg-blue-700 text-white flex flex-col">
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold">Food Donate</h1>
          <h1 className="mt-2">Welcome {isAdmin ? 'Admin' : user?.fullname || 'User'}</h1>
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
      <div className="flex-grow bg-gray-100">
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
              <div className="bg-white p-4 rounded-lg shadow-md">
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
                      {donations.slice(0, 5).map((donation) => (
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-2 gap-4">
                {/* Bar Chart Section */}
                <div className="bg-white p-4 rounded-lg shadow-md h-120">
                  <h3 className="text-lg font-bold mb-4">Clients</h3>
                  <div className="h-96">
                    <Bar data={barData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>

                {/* Pie Chart Section */}
                <div className="bg-white p-4 rounded-lg shadow-md h-120">
                  <h3 className="text-lg font-bold mb-4">Sources of Food Products</h3>
                  <div className="h-96">
                    <Pie data={pieData} options={{ maintainAspectRatio: false }} />
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
              <Profile />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;