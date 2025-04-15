import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3001";

function App() {
  const [positions, setPositions] = useState([]);
  const [margin, setMargin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(1); // default to 1


  useEffect(() => {
    if (!selectedClientId) return;
  
    async function fetchData() {
      try {
        const [posRes, marginRes] = await Promise.all([
          axios.get(`${API_BASE}/api/positions/${selectedClientId}`),
          axios.get(`${API_BASE}/api/margin-status/${selectedClientId}`),
        ]);
        setPositions(posRes.data.positions);
        setMargin(marginRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, [selectedClientId]); // re-run when selectedClientId changes
  

  const handleSync = async () => {
    try {
      await axios.post(`${API_BASE}/api/sync-prices`);
      alert("Prices synced successfully!");
      window.location.reload(); // or re-fetch data more cleanly
    } catch (error) {
      console.error("Sync failed:", error);
      alert("Failed to sync prices.");
    }
  };
  
  useEffect(() => {
    axios.get(`${API_BASE}/api/clients`)
      .then(res => setClients(res.data))
      .catch(err => console.error("Failed to fetch clients:", err));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial" }}>

    <label>Select Client: </label>
    <select
      value={selectedClientId}
      onChange={(e) => setSelectedClientId(Number(e.target.value))}
    >
      {clients.map(client => (
        <option key={client.id} value={client.id}>
          {client.id}
        </option>
      ))}
    </select>

      <h1>Client #{selectedClientId} Portfolio</h1>

      <button onClick={handleSync} style={{ marginBottom: "1rem" }}>
        Sync Market Prices
      </button>

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

export default App;
