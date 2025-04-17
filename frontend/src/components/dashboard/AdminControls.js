// src/components/dashboard/AdminControls.js

import React from "react";
import axios from "axios";

function AdminControls({ token, mmr, mmrInput, setMmrInput, setMmr }) {
  const API_BASE = "http://localhost:3001";

  const handleUpdate = async () => {
    const parsedValue = parseFloat(mmrInput);

    if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100) {
      alert("Please enter a valid MMR between 0 and 100 (inclusive).");
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(mmrInput)) {
      alert("MMR can only have up to 2 decimal places.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/api/mmr`,
        { mmr: parsedValue / 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("MMR updated.");
      setMmr(parsedValue / 100);
      setMmrInput("");
    } catch (err) {
      console.error("Failed to update MMR:", err);
      alert("Failed to update MMR.");
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Admin Controls</h3>
      <div className="flex items-center gap-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Current MMR:</p>
          <p className="font-semibold text-lg">{(mmr * 100).toFixed(2)}%</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">New MMR (%):</label>
          <input
            type="number"
            min="0.01"
            max="100"
            step="0.01"
            value={mmrInput}
            onChange={(e) => setMmrInput(e.target.value)}
            placeholder="e.g. 25"
            className="border px-3 py-1 rounded w-24"
          />
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminControls;
