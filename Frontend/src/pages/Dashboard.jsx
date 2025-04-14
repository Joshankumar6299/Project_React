import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from "chart.js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import TotalUser from "./totalUser";
// import TotalDonor from "./totalDonar";
import Profile from "./Profile";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('accessToken');
    console.log("Dashboard - Token found:", !!token);
    
    if (!token) {
      console.log("Dashboard - No token found, redirecting to login");
      toast.error("Authentication required. Please login.");
      navigate('/login', { state: { from: '/dashboard' } });
      return;
    }
    
    // Set loading to false since we have a token
    setIsLoading(false);
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
          <h1 className="mt-2">Welcome Admin</h1>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 px-4">
            {["Dashboard", "Total User", "Total Donor", "Profile"].map((page) => (
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
                  <h3 className="text-lg font-bold">Total Donation</h3>
                  <p className="text-2xl font-bold">500K</p>
                </div>
                <div className="bg-green-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-bold">Weekly Donation</h3>
                  <p className="text-2xl font-bold">100K</p>
                </div>
                <div className="bg-teal-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-bold">Daily Donation</h3>
                  <p className="text-2xl font-bold">20K</p>
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