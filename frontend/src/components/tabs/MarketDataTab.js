import React, { useEffect, useState } from "react";
import axios from "axios";
import MarketDataChart from "../charts/MarketDataChart";

function MarketDataTab() {
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const API_BASE = "http://localhost:3001";

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/market-data/`);
        const uniqueSymbols = [...new Set(res.data.map(item => item.symbol))];
        setSymbols(uniqueSymbols);
        setSelectedSymbol(uniqueSymbols[0]);
      } catch (err) {
        console.error("Failed to fetch market symbols:", err);
      }
    };

    fetchSymbols();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2 text-sm font-medium">Select Symbol:</label>
          <select
            className="px-3 py-2 border rounded"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
          >
            {symbols.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {user.role === "admin" && (
          <button
            onClick={async () => {
              try {
                await axios.post(`${API_BASE}/api/sync-prices`, {}, {
                  headers: { Authorization: `Bearer ${token}` }
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
        )}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Market Data</h3>
        {selectedSymbol && <MarketDataChart symbol={selectedSymbol} />}
      </div>
    </div>
  );
}

export default MarketDataTab;
