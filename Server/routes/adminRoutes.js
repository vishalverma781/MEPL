import express from "express";
import adminCtrl from "../controller/adminController.js";
import authenticateToken from "../middleware/authMiddeleware.js"; // ✅ import middleware

const router = express.Router();

// All Admin routes
router.post("/", authenticateToken, adminCtrl.createAdmin);       // Add Admin
router.get("/", authenticateToken, adminCtrl.getAllAdmins);       // All Admins
router.put("/:id", authenticateToken, adminCtrl.updateAdmin);     // Manage/Edit Admin
router.delete("/:id", authenticateToken, adminCtrl.deleteAdmin);  // Delete Admin

export default router;
