const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const { calculateMarginStatus } = require("../utils/marginUtils");

router.get("/:clientId", authenticateToken, async (req, res) => {
  const { clientId } = req.params;

  if (req.user.role === "client" && req.user.clientId != clientId) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const positionsResult = await db.query(`
      SELECT p.quantity, md.current_price
      FROM positions p
      LEFT JOIN LATERAL (
        SELECT price AS current_price
        FROM market_data md
        WHERE md.symbol = p.symbol
        ORDER BY timestamp DESC
        LIMIT 1
      ) md ON true
      WHERE p.client_id = $1
    `, [clientId]);

    if (positionsResult.rows.length === 0) {
      return res.status(404).json({ error: "No positions found for this client." });
    }

    const loanRes = await db.query(`SELECT loan_amount FROM margin WHERE client_id = $1`, [clientId]);
    if (loanRes.rows.length === 0) {
      return res.status(404).json({ error: "No loan data found for this client." });
    }

    const mmrRes = await db.query(`SELECT value FROM settings WHERE key = 'mmr'`);
    const mmr = parseFloat(mmrRes.rows[0].value);

    const loanAmount = parseFloat(loanRes.rows[0].loan_amount);
    const portfolioValue = positionsResult.rows.reduce((acc, pos) => {
      const qty = parseFloat(pos.quantity);
      const price = parseFloat(pos.current_price || 0);
      return acc + qty * price;
    }, 0);

    const result = calculateMarginStatus( portfolioValue, loanAmount, mmr );
    result.clientId = parseInt(clientId); // preserve original response structure

    res.json(result);
  } catch (err) {
    console.error("Error calculating margin status:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
