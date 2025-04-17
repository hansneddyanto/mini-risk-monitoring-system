import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function ClientBarChart({ data }) {
  const maxYValue = Math.max(...data.map(d => Math.max(d.portfolioValue, d.loanAmount)));
  const yAxisMax = Math.ceil(maxYValue * 1.1);
  const step = 50000;
  const ticks = Array.from({ length: Math.ceil(yAxisMax / step) + 1 }, (_, i) => i * step);

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Portfolio Overview (Per Client)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="clientName" />
          <YAxis
            domain={[0, yAxisMax]}
            ticks={ticks}
            tickFormatter={value => value.toLocaleString()}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="portfolioValue" fill="#8884d8" name="Portfolio Value" />
          <Bar dataKey="loanAmount" fill="#f87171" name="Loan Amount" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ClientBarChart;
