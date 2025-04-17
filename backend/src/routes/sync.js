const express = require("express");
const router = express.Router();
const db = require("../db");
const { fetchPrice } = require("../utils/marketData");

router.post("/sync-prices", async (req, res) => {
  try {
    const symbolsResult = await db.query("SELECT DISTINCT symbol FROM positions");
    const symbols = symbolsResult.rows.map(row => row.symbol);

    for (const symbol of symbols) {
      const price = await fetchPrice(symbol);
      if (price) {
        await db.query(
          `INSERT INTO market_data (symbol, price, timestamp)
           VALUES ($1, $2, NOW())`,
          [symbol, price]
        );
      }
    }

    res.json({ message: "Prices updated successfully." });
  } catch (err) {
    console.error("Error syncing prices:", err.message);
    res.status(500).json({ error: "Failed to update prices" });
  }
});

module.exports = router;
