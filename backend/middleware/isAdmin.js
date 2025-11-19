// backend/middleware/isAdmin.js
import jwt from "jsonwebtoken";

const isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Ensure this sets req.user
    console.log("Decoded user:", decoded); // Add this for debugging
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default isAdmin;