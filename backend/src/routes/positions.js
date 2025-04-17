const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// GET /api/positions/:clientId
router.get("/:clientId", authenticateToken, async (req, res) => {
  const { clientId } = req.params;

  // Admins can access all; clients can only access their own
  if (req.user.role === "client" && req.user.clientId != clientId) {
    return res.status(403).json({ error: "Access denied" });
  }
  
  try {
    const query = `
      SELECT 
        p.symbol, 
        p.quantity, 
        p.cost_basis, 
        md.price AS current_price
      FROM positions p
      LEFT JOIN LATERAL (
        SELECT price
        FROM market_data md
        WHERE md.symbol = p.symbol
        ORDER BY timestamp DESC
        LIMIT 1
      ) md ON true
      WHERE p.client_id = $1
    `;

    const { rows } = await db.query(query, [clientId]);

    res.json({ positions: rows });
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
