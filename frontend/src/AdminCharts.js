import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

function AdminCharts({ token }) {
  const [data, setData] = useState([]);
  const API_BASE = "http://localhost:3001";

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/clients-summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch client summary:", err);
      }
    };
    fetch();
  }, [token]);

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Portfolio Overview</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="clientName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="portfolioValue" fill="#8884d8" name="Portfolio Value" />
          <Bar dataKey="loanAmount" fill="#f87171" name="Loan Amount" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AdminCharts;
