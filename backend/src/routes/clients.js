const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/clients", async (req, res) => {
  try {
    const result = await db.query("SELECT id, name FROM clients");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching clients:", err.message);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

module.exports = router;
