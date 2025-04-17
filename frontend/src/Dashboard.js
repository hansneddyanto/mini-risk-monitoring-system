import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminCharts from "./components/AdminCharts";

function Dashboard() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [positions, setPositions] = useState([]);
  const [margin, setMargin] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(user.clientId || 1);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const API_BASE = "http://localhost:3001";

  useEffect(() => {
    if (!token) return;

    const fetchAll = async () => {
      try {
        if (user.role === "admin") {
          const res = await axios.get(`${API_BASE}/api/clients`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setClients(res.data);
        }

        const [posRes, marginRes] = await Promise.all([
          axios.get(`${API_BASE}/api/positions/${selectedClientId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE}/api/margin-status/${selectedClientId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPositions(posRes.data.positions);
        setMargin(marginRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchAll();
  }, [token, selectedClientId, user.role]);

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
        {user.role === "admin" && (
          <button
            onClick={() => setActiveTab("charts")}
            className={`px-4 py-2 rounded ${activeTab === "charts" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Data Visualizations
          </button>
        )}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <>
          {user.role === "admin" && (
            <div className="mb-6">
              <label className="text-sm font-medium mr-2">View Client:</label>
              <select
                className="px-3 py-2 border rounded"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(Number(e.target.value))}
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (ID: {c.id})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Portfolio Table */}
          <h3 className="text-lg font-bold mb-2 text-gray-700">Positions</h3>
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border rounded bg-white shadow">
              <thead className="bg-gray-200 text-sm text-left">
                <tr>
                  <th className="px-4 py-2">Symbol</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Cost Basis</th>
                  <th className="px-4 py-2">Current Price</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos, i) => (
                  <tr key={i} className="border-t text-sm">
                    <td className="px-4 py-2">{pos.symbol}</td>
                    <td className="px-4 py-2">{pos.quantity}</td>
                    <td className="px-4 py-2">${pos.cost_basis}</td>
                    <td className="px-4 py-2">${pos.current_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Margin Status */}
          {margin && (
            <div
              className={`p-6 rounded shadow-md ${
                margin.marginCall
                  ? "bg-red-100 border border-red-400 text-red-800"
                  : "bg-green-100 border border-green-400 text-green-800"
              }`}
            >
              <h3 className="text-lg font-bold mb-2">Margin Status</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Portfolio Value:</strong> ${margin.portfolioValue.toFixed(2)}</li>
                <li><strong>Loan Amount:</strong> ${margin.loanAmount.toFixed(2)}</li>
                <li><strong>Net Equity:</strong> ${margin.netEquity.toFixed(2)}</li>
                <li><strong>Margin Requirement:</strong> ${margin.marginRequirement.toFixed(2)}</li>
                <li><strong>Shortfall:</strong> ${margin.marginShortfall.toFixed(2)}</li>
              </ul>
              <p className="mt-4 font-semibold text-base">
                {margin.marginCall ? "⚠️ Margin Call Triggered!" : "✅ No Margin Call"}
              </p>
            </div>
          )}

          {/* Admin Controls */}
          {user.role === "admin" && (
            <div className="bg-white shadow p-6 rounded mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Admin Controls</h3>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                <button
                  onClick={async () => {
                    try {
                      await axios.post(`${API_BASE}/api/sync-prices`, {}, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      alert("Prices synced successfully!");
                    } catch (err) {
                      console.error("Sync failed:", err);
                      alert("Failed to sync prices.");
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Sync Market Prices
                </button>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Set MMR (%):</label>
                  <input
                    type="number"
                    min="0.1"
                    max="1"
                    step="0.01"
                    value={margin?.mmr || 0.25}
                    onChange={(e) =>
                      setMargin((prev) => ({ ...prev, mmr: parseFloat(e.target.value) }))
                    }
                    className="border px-3 py-1 rounded w-20"
                  />
                  <button
                    onClick={async () => {
                      try {
                        await axios.post(
                          `${API_BASE}/api/mmr`,
                          { mmr: margin.mmr },
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        alert("MMR updated.");
                      } catch (err) {
                        console.error("Failed to update MMR:", err);
                        alert("Failed to update MMR.");
                      }
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Charts Tab */}
      {activeTab === "charts" && user.role === "admin" && (
        <AdminCharts token={token} />
      )}
    </div>
  );
}

export default Dashboard;
