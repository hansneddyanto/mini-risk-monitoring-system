const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

router.get("/clients", authenticateToken, async (req, res) => {
  try {
    const clientRes = await db.query(`
      SELECT id, name FROM clients ORDER BY id
    `);
    res.json(clientRes.rows);
  } catch (err) {
    console.error("Error fetching clients list:", err);
    res.status(500).json({ error: "Failed to load clients list." });
  }
});

module.exports = router;
