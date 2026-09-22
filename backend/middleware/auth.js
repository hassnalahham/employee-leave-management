const jwt = require("jsonwebtoken");

// This project for learning so we don't need signin key
const JWT_SECRET = "leave_management_dev_secret";

// Verifies the Bearer token and attaches { id, role, name } to req.user.
function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Restricts a route to a single role, e.g. requireRole("Manager").
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: `${role} access required` });
    }
    next();
  };
}

module.exports = { auth, requireRole, JWT_SECRET };
