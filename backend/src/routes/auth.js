const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // for local testing



router.post("/register", async (req, res) => {
  const { email, password, role, name } = req.body;

  // Basic validation
  if (!email || !password || !role || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!["admin", "client"].includes(role)) {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  try {
    // Check for duplicate email
    const existingUser = await db.query("SELECT 1 FROM users WHERE email = $1", [email]);
    if (existingUser.rowCount > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    await db.query("BEGIN");

    const hashedPassword = await bcrypt.hash(password, 10);

    let clientId = null;

    if (role === "client") {
      const clientRes = await db.query(
        "INSERT INTO clients (name) VALUES ($1) RETURNING id",
        [name]
      );
      clientId = clientRes.rows[0].id;
    }

    await db.query(
      `INSERT INTO users (email, password, role, client_id)
       VALUES ($1, $2, $3, $4)`,
      [email, hashedPassword, role, clientId]
    );

    await db.query("COMMIT");
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Registration failed:", err.message);
    res.status(500).json({ error: "Registration failed." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRes = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userRes.rowCount === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = userRes.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = {
      userId: user.id,
      role: user.role,
      clientId: user.client_id || null,
      email: user.email,
      name: user.name || 'hahaha'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: payload });
  } catch (err) {
    console.error("Login failed:", err.message);
    res.status(500).json({ error: "Login failed." });
  }
});


module.exports = router;
