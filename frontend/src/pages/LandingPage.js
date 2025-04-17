// src/pages/LandingPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardTab from "../components/tabs/DashboardTab";
import DataVisualizationsTab from "../components/tabs/DataVisualizationsTab";
import MarketDataTab from "../components/tabs/MarketDataTab";

function LandingPage() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome, {user.name} ({user.role})
        </h2>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded ${activeTab === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("market")}
          className={`px-4 py-2 rounded ${activeTab === "market" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Market Data
        </button>
        {user.role === "admin" && (
          <button
            onClick={() => setActiveTab("charts")}
            className={`px-4 py-2 rounded ${activeTab === "charts" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Data Visualizations
          </button>
        )}
      </div>

      {/* Tabs Content */}
      {activeTab === "dashboard" && <DashboardTab token={token} user={user} />}
      {activeTab === "market" && <MarketDataTab token={token} user={user} />}
      {activeTab === "charts" && user.role === "admin" && <DataVisualizationsTab token={token} />}
    </div>
  );
}

export default LandingPage;
