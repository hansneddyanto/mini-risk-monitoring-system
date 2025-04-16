function requireAdmin(req, res, next) {
    if (req.user && req.user.role === "admin") {
      return next(); // Let admin through
    }
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  
  module.exports = requireAdmin;
  