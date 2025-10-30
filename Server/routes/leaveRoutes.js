import express from "express";
import {
  applyLeave,
  getAllLeaves,
  getUserLeaves,
  updateLeaveStatus,
} from "../controller/leaveController.js";
import authenticateToken from "../middleware/authMiddeleware.js";

const router = express.Router();

router.post("/apply", authenticateToken, applyLeave);
router.get("/all", authenticateToken, getAllLeaves);
router.get("/user", authenticateToken, getUserLeaves);
router.put("/update/:id", authenticateToken, updateLeaveStatus);

export default router;
