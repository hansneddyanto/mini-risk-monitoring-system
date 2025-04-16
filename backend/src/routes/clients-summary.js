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

module.exports = router;
