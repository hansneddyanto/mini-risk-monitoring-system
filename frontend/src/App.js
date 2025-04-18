import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/LandingPage";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
