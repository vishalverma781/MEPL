import express from "express";
import Attendance from "../model/attendanceModel.js";
import Leave from "../model/LeaveModel.js";
import TrackIssue from "../model/IssueModel.js";
import Payroll from "../model/PayrollModel.js";

const router = express.Router();

// ✅ Employee Dashboard Count API
router.get("/employee-counts", async (req, res) => {
  try {
    const attendance = await Attendance.countDocuments();
    const leaves = await Leave.countDocuments();
    const trackIssues = await TrackIssue.countDocuments();
    const payrolls = await Payroll.countDocuments();

    // ✅ Response
    res.json({
      attendance,
      leaves,
      trackIssues,
      payrolls,
    });
  } catch (error) {
    console.error("Error fetching employee dashboard counts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
