import React, { useEffect, useState } from "react";
import axios from "axios";

function DashboardTab({ token, user }) {
  const [positions, setPositions] = useState([]);
  const [margin, setMargin] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(user.clientId || 1);

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
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchAll();
  }, [token, selectedClientId, user.role]);

  return (
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

      {/* Positions Table */}
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

      {/* Margin Info */}
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

      {/* Admin MMR Control */}
      {user.role === "admin" && (
        <div className="bg-white shadow p-6 rounded mt-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Admin Controls</h3>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Set MMR (%):</label>
            <input
              type="number"
              min="0.1"
              max="100"
              step="0.01"
              value={(margin?.mmr || 0.25) * 100}
              onChange={(e) =>
                setMargin((prev) => ({
                  ...prev,
                  mmr: parseFloat(e.target.value) / 100,
                }))
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
      )}
    </>
  );
}

export default DashboardTab;
