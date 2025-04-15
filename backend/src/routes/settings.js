const express = require("express");
const router = express.Router();
const db = require("../db");

// GET current MMR
router.get("/mmr", async (req, res) => {
  try {
    const result = await db.query("SELECT value FROM settings WHERE key = 'mmr'");
    res.json({ mmr: result.rows[0].value });
  } catch (err) {
    console.error("Error fetching MMR:", err.message);
    res.status(500).json({ error: "Failed to get MMR" });
  }
});

// POST update MMR
router.post("/mmr", async (req, res) => {
  const { mmr } = req.body;
  try {
    await db.query("UPDATE settings SET value = $1 WHERE key = 'mmr'", [mmr]);
    res.json({ message: "MMR updated", mmr });
  } catch (err) {
    console.error("Error updating MMR:", err.message);
    res.status(500).json({ error: "Failed to update MMR" });
  }
});

module.exports = router;
