const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/requireAdmin");

router.get("/clients-summary", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const clientRes = await db.query(`
      SELECT 
        c.id, 
        c.name AS "clientName",
        COALESCE(SUM(p.quantity * md.current_price), 0) AS "portfolioValue",
        COALESCE(m.loan_amount, 0) AS "loanAmount"
      FROM clients c
      LEFT JOIN positions p ON p.client_id = c.id
      LEFT JOIN market_data md ON md.symbol = p.symbol
      LEFT JOIN margin m ON m.client_id = c.id
      GROUP BY c.id, c.name, m.loan_amount
      ORDER BY c.id
    `);

    res.json(clientRes.rows);
  } catch (err) {
    console.error("Error fetching client summary:", err);
    res.status(500).json({ error: "Failed to load client summary." });
  }
});

router.get("/clients-aggregate", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const aggRes = await db.query(`
      SELECT
        COUNT(DISTINCT c.id) AS "totalClients",
        COALESCE(SUM(p.total_portfolio_value), 0) AS "totalPortfolioValue",
        COALESCE(SUM(m.total_loan_amount), 0) AS "totalLoanAmount",
        COALESCE(SUM(p.total_portfolio_value), 0) - COALESCE(SUM(m.total_loan_amount), 0) AS "totalClientNetEquity"
      FROM clients c
      LEFT JOIN (
        SELECT 
          p.client_id, 
          SUM(p.quantity * md.current_price) AS total_portfolio_value
        FROM positions p
        LEFT JOIN market_data md ON md.symbol = p.symbol
        GROUP BY p.client_id
      ) p ON p.client_id = c.id
      LEFT JOIN (
        SELECT 
          client_id, 
          SUM(loan_amount) AS total_loan_amount
        FROM margin
        GROUP BY client_id
      ) m ON m.client_id = c.id
    `);

    res.json(aggRes.rows[0]);
  } catch (err) {
    console.error("Error fetching aggregate client data:", err);
    res.status(500).json({ error: "Failed to load aggregate summary." });
  }
});


module.exports = router;
