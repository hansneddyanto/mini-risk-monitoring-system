const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ROUTES
const positionRoutes = require("./routes/positions");
app.use("/api/positions", positionRoutes);
const marginRoutes = require("./routes/margin");
app.use("/api/margin-status", marginRoutes);
const syncRoutes = require("./routes/sync");
app.use("/api", syncRoutes);

// DB connection test
db.query("SELECT NOW()")
  .then(res => console.log("DB connected at:", res.rows[0].now))
  .catch(err => console.error("DB connection error:", err));

app.get("/", (req, res) => {
  res.send("Mini Risk Monitoring Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
