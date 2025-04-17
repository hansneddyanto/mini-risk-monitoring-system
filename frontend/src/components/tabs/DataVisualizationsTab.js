import React, { useEffect, useState } from "react";
import axios from "axios";
import ClientBarChart from "../charts/ClientBarChart";
import PortfolioPieChart from "../charts/PortfolioPieChart";

function DataVisualizationsTab({ token }) {
  const [perClientData, setPerClientData] = useState([]);
  const [aggregateData, setAggregateData] = useState(null);

  const API_BASE = "http://localhost:3001";

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
      <ClientBarChart data={perClientData} />
      <PortfolioPieChart data={aggregateData} />
    </div>
  );
}

export default DataVisualizationsTab;
