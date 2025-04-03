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

     
    </div>
  );
};

export default Dashboard;