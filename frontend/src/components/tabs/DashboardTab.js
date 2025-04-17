import React, { useEffect, useState } from "react";
import axios from "axios";

import MarginStatusCard from "../dashboard/MarginStatusCard";
import AdminControls from "../dashboard/AdminControls";
import PositionsTable from "../dashboard/PositionsTable";

function DashboardTab({ token, user }) {
  const [positions, setPositions] = useState([]);
  const [margin, setMargin] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(user.clientId || 1);
  const [mmr, setMmr] = useState(null);
  const [mmrInput, setMmrInput] = useState("");

  const API_BASE = "http://localhost:3001";

  useEffect(() => {
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

    if (token) fetchAll();
  }, [token, selectedClientId, user.role]);

  useEffect(() => {
    const fetchMmr = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/mmr`);
        setMmr(res.data.mmr);
      } catch (err) {
        console.error("Failed to fetch MMR:", err);
      }
    };

    fetchMmr();
  }, []);

  return (
    <>
      {/* Client Selector (Admins only) */}
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
      <PositionsTable positions={positions} />

      {/* Margin Info */}
      <MarginStatusCard margin={margin} />

      {/* Admin MMR Control */}
      {user.role === "admin" && (
        <AdminControls
          token={token}
          mmr={mmr}
          mmrInput={mmrInput}
          setMmrInput={setMmrInput}
          setMmr={setMmr}
        />
      )}
    </>
  );
}

export default DashboardTab;
