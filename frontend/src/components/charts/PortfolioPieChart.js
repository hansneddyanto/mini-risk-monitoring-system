import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

function PortfolioPieChart({ data }) {
  if (!data) return null;

  const chartData = [
    {
      name: "Total Net Equity",
      value: parseFloat(data.totalClientNetEquity),
    },
    {
      name: "Total Loan Amount",
      value: parseFloat(data.totalLoanAmount),
    },
  ];

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Portfolio Breakdown (By Client Net Equity and Total Loan Amount)
      </h3>
      <div className="flex justify-center">
        <PieChart width={400} height={300}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            <Cell fill="#60a5fa" />
            <Cell fill="#f87171" />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}

export default PortfolioPieChart;
