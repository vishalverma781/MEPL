import jwt from "jsonwebtoken";
import { dotenvVar } from "../config.js";

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(' ')[1]; // Extract token

  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, dotenvVar.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Invalid token, please login again" });
    }

    // Employee-specific adjustments
    if (user.role === "Employee") {
      req.user = {
        id: user.id,
        username: user.username,      // Attach employee username
        fullName: user.fullName,      // Attach employee fullName
        plaza: user.plaza || "N/A",   // Attach plaza name
        role: user.role
      };
    } else {
      // Admin or other roles
      req.user = user;
    }

    next();
  });
}

export default authenticateToken;
