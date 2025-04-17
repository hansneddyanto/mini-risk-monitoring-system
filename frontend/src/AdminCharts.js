import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function AdminCharts({ token }) {
  const [perClientData, setPerClientData] = useState([]);
  const [aggregateData, setAggregateData] = useState(null);

  const API_BASE = "http://localhost:3001";

  const maxYValue = Math.max(
    ...perClientData.map(d => Math.max(d.portfolioValue, d.loanAmount))
  );
  
  const yAxisMax = Math.ceil(maxYValue * 1.1); // add 10% buffer
  const step = 50000;
  const ticks = [];
  for (let i = 0; i <= yAxisMax; i += step) {
    ticks.push(i);
  }
  

  useEffect(() => {
    const fetch = async () => {
      try {
        const clientRes = await axios.get(`${API_BASE}/api/clients-summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const aggRes = await axios.get(`${API_BASE}/api/clients-aggregate`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPerClientData(clientRes.data);
        setAggregateData(aggRes.data);

      } catch (err) {
        console.error("Failed to fetch chart data:", err);
      }
    };

    fetch();
  }, [token]);

  return (
    <div>
      {/* Per-client bar chart */}
      <div className="bg-white p-6 rounded shadow mt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Portfolio Overview (Per Client)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={perClientData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="clientName" />
            <YAxis
              domain={[0, yAxisMax]}
              ticks={ticks}
              tickFormatter={(value) => value.toLocaleString()}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="portfolioValue" fill="#8884d8" name="Portfolio Value" />
            <Bar dataKey="loanAmount" fill="#f87171" name="Loan Amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>


      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Portfolio Breakdown (By Client Net Equity and Total Loan Amount)
      </h3>
      {/* Aggregate pie chart */}
      {aggregateData && (
        <div className="flex justify-center">
        <PieChart width={400} height={300}>
          <Pie
            data={[
              {
                name: "Total Net Equity",
                value: parseFloat(aggregateData.totalClientNetEquity),
              },
              {
                name: "Total Loan Amount",
                value: parseFloat(aggregateData.totalLoanAmount),
              },
            ]}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
          >
            <Cell fill="#60a5fa" />
            <Cell fill="#f87171" />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
      
      )}
    </div>
  );
}

export default AdminCharts;
