const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

router.get("/:clientId", authenticateToken, async (req, res) => {
  const { clientId } = req.params;

  // Clients can only access their own data
  if (req.user.role === "client" && req.user.clientId != clientId) {
    return res.status(403).json({ error: "Access denied" });
  }
  
  try {
    // 1. Fetch positions with current prices
    const positionsQuery = `
      SELECT 
        p.symbol,
        p.quantity,
        md.current_price
      FROM positions p
      LEFT JOIN LATERAL (
        SELECT price AS current_price
        FROM market_data md
        WHERE md.symbol = p.symbol
        ORDER BY timestamp DESC
        LIMIT 1
      ) md ON true
      WHERE p.client_id = $1
    `;
    const positionsResult = await db.query(positionsQuery, [clientId]);
    const positions = positionsResult.rows;

    if (positions.length === 0) {
      return res.status(404).json({ error: "No positions found for this client." });
    }

    // 2. Fetch loan amount
    const loanQuery = `SELECT loan_amount FROM margin WHERE client_id = $1`;
    const loanResult = await db.query(loanQuery, [clientId]);

    if (loanResult.rows.length === 0) {
      return res.status(404).json({ error: "No loan data found for this client." });
    }

    const loanAmount = parseFloat(loanResult.rows[0].loan_amount);

    // 3. Calculate metrics
    let portfolioValue = 0;
    for (const pos of positions) {
      const qty = parseFloat(pos.quantity);
      const price = parseFloat(pos.current_price || 0); // fallback in case price is null
      portfolioValue += qty * price;
    }

    const mmrResult = await db.query("SELECT value FROM settings WHERE key = 'mmr'");
    const mmr = parseFloat(mmrResult.rows[0].value); // e.g., 0.25
    const netEquity = portfolioValue - loanAmount;
    const marginRequirement = mmr * portfolioValue;
    const marginShortfall = marginRequirement - netEquity;
    const marginCall = marginShortfall > 0;

    // 4. Send response
    res.json({
      clientId: parseInt(clientId),
      portfolioValue,
      loanAmount,
      netEquity,
      marginRequirement,
      marginShortfall,
      marginCall,
    });
  } catch (err) {
    console.error("Error calculating margin status:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
