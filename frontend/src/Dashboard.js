import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const API_BASE = "http://localhost:3001";
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(user.clientId || 1);
  const [positions, setPositions] = useState([]);
  const [margin, setMargin] = useState(null);
  const [mmr, setMmr] = useState(0.25); // default MMR

  // Fetch client list for admin
  useEffect(() => {
    if (user.role === "admin") {
      axios
        .get(`${API_BASE}/api/clients`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setClients(res.data))
        .catch((err) => console.error("Failed to load clients:", err));
    }
  }, [user.role, token]);

  // Fetch current MMR
  useEffect(() => {
    if (user.role === "admin") {
      axios
        .get(`${API_BASE}/api/mmr`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setMmr(res.data.mmr))
        .catch((err) => console.error("Failed to load MMR:", err));
    }
  }, [user.role, token]);

  // Fetch positions and margin status
  useEffect(() => {
    if (!token || !selectedClientId) return;

    const fetchData = async () => {
      try {
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

    fetchData();
  }, [selectedClientId, token]);

  const handleSync = async () => {
    try {
      await axios.post(`${API_BASE}/api/sync-prices`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Prices synced successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Sync failed:", err);
      alert("Failed to sync prices.");
    }
  };

  const handleUpdateMMR = async () => {
    try {
      await axios.post(`${API_BASE}/api/mmr`, { mmr: parseFloat(mmr) }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("MMR updated");
      window.location.reload();
    } catch (err) {
      console.error("Failed to update MMR:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>
      Welcome, {user.name || "User"} ({user.role})
      </h2>


      <button
      onClick={() => {
        localStorage.clear();
        navigate("/login");
      }}
      >
      Logout
      </button>


      {user.role === "admin" && (
        <>
          <div style={{ margin: "1rem 0" }}>
            <label>Select Client: </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(Number(e.target.value))}
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (#{c.id})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <button onClick={handleSync}>Sync Market Prices</button>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>MMR (%): </label>
            <input
              type="number"
              step="0.01"
              min="0.1"
              max="1"
              value={mmr}
              onChange={(e) => setMmr(e.target.value)}
            />
            <button onClick={handleUpdateMMR} style={{ marginLeft: "1rem" }}>
              Update MMR
            </button>
          </div>
        </>
      )}

      <h2>Positions</h2>
      <table border="1" cellPadding="8" style={{ marginBottom: "1rem" }}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Cost Basis</th>
            <th>Current Price</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos, i) => (
            <tr key={i}>
              <td>{pos.symbol}</td>
              <td>{pos.quantity}</td>
              <td>${pos.cost_basis}</td>
              <td>${pos.current_price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {margin && (
        <>
          <h2>Margin Status</h2>
          <ul>
            <li><strong>Portfolio Value:</strong> ${margin.portfolioValue.toFixed(2)}</li>
            <li><strong>Loan Amount:</strong> ${margin.loanAmount.toFixed(2)}</li>
            <li><strong>Net Equity:</strong> ${margin.netEquity.toFixed(2)}</li>
            <li><strong>Margin Requirement:</strong> ${margin.marginRequirement.toFixed(2)}</li>
            <li><strong>Shortfall:</strong> ${margin.marginShortfall.toFixed(2)}</li>
          </ul>

          <p style={{ 
            color: margin.marginCall ? "red" : "green",
            fontWeight: "bold"
          }}>
            {margin.marginCall ? "⚠️ Margin Call Triggered!" : "✅ No Margin Call"}
          </p>
        </>
      )}
    </div>
  );
}

export default Dashboard;
