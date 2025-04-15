const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/market-data", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT DISTINCT ON (symbol) symbol, current_price, timestamp
      FROM market_data
      ORDER BY symbol, timestamp DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching market data:", err.message);
    res.status(500).json({ error: "Failed to fetch market data" });
  }
});

module.exports = router;
