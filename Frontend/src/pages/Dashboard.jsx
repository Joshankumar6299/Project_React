import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from "chart.js";
import TotalUser from "./totalUser";
import TotalDonor from "./totalDonar";
import Profile from "./profile";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");

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

  return (
    <div className="flex h-screen">
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
          <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
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