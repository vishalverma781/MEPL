import express from "express";
import {
  getAllAttendance,
  createAttendance,
  updateAttendanceStatus,
    filterAttendance,
} from "../controller/attendanceController.js";

const router = express.Router();

// GET all attendance records
router.get("/", getAllAttendance);

// POST create new attendance record
router.post("/", createAttendance);

// PATCH update attendance status by ID
router.patch("/:id", updateAttendanceStatus);
router.get("/filter", filterAttendance);

export default router;
