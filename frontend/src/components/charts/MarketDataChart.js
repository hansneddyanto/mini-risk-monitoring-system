import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

function MarketDataChart({ symbol }) {
  const [data, setData] = useState([]);
  const API_BASE = "http://localhost:3001";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/market-data/${symbol}`);
        const formatted = res.data.map((item) => ({
          ...item,
          timestamp: format(new Date(item.timestamp), "yyyy-MM-dd"),
        }));
        setData(formatted);
      } catch (err) {
        console.error("Failed to fetch historical market data:", err);
      }
    };

    if (symbol) fetchData();
  }, [symbol]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="timestamp" />
          <YAxis
            domain={["auto", "auto"]}
            tick={false}
            axisLine={false}
            label={false}
          />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MarketDataChart;
