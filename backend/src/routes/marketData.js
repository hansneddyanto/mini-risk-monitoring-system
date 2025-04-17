const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/market-data", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT symbol, price, timestamp
      FROM market_data
      ORDER BY symbol, timestamp DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching market data:", err.message);
    res.status(500).json({ error: "Failed to fetch market data" });
  }
});

router.get("/market-data/:symbol", async (req, res) => {
  const { symbol } = req.params;
  try {
    const result = await db.query(
      `SELECT symbol, price, timestamp 
       FROM market_data 
       WHERE symbol = $1 
       ORDER BY timestamp ASC`,
      [symbol]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching historical data:", err.message);
    res.status(500).json({ error: "Failed to fetch historical data" });
  }
});


module.exports = router;
