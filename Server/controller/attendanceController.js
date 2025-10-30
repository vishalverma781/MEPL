import Attendance from "../model/attendanceModel.js";
import Employee from "../model/EmployeeModel.js";
import jwt from "jsonwebtoken";

// ✅ GET attendance (by selected date or today's date)
export const getAllAttendance = async (req, res) => {
  try {
    const { date } = req.query; // frontend se aayegi date ?date=yyyy-MM-dd format me

    let startOfDay, endOfDay;

    if (date) {
      // 🗓 agar koi specific date bheji gayi ho
      startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
    } else {
      // 🕓 agar date nahi di gayi ho to default aaj ki date le
      startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
    }

    // ✅ filter only records within that day
    const records = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ date: -1 });

    res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({
      message: "Failed to fetch attendance records",
      error: err.message,
    });
  }
};

// CREATE attendance
export const createAttendance = async (req, res) => {
  try {
    let { fullName, status, date } = req.body;
    let markedBy = "Admin"; // default

    // ✅ Get user from JWT
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized. Token missing." });

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }

    // ✅ Set markedBy based on role
    if (decoded.role === "Admin" || decoded.role === "SuperAdmin") {
      markedBy = decoded.username; // Admin ka username
    } else if (decoded.role === "Employee") {
      const employee = await Employee.findById(decoded.id);
      if (!employee) return res.status(404).json({ message: "User not found" });

      fullName = employee.fullName || employee.username;
      markedBy = fullName; // Employee ka naam
    }

    const newRecord = await Attendance.create({
      fullName,
      status: status || "Present",
      markedBy,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json(newRecord);
  } catch (err) {
    console.error("Error creating attendance:", err);
    res.status(500).json({
      message: "Failed to create attendance record",
      error: err.message,
    });
  }
};

// UPDATE attendance status
export const updateAttendanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["Present", "Absent", "On Leave", "WFH"];
    if (!status || !validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid or missing status" });
    }

    const record = await Attendance.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true } // ✅ returns updated record & validates enum
    );

    if (!record) return res.status(404).json({ message: "Attendance record not found" });

    res.status(200).json(record);
  } catch (err) {
    console.error("Error updating attendance:", err);
    res.status(500).json({ message: "Failed to update attendance", error: err.message });
  }
};

// ✅ FILTER attendance by employee name, date range, and status
export const filterAttendance = async (req, res) => {
  try {
    const { fullName, startDate, endDate, status } = req.query;

    if (!fullName || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing filters" });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // 🔹 Build the query object
    const query = {
      fullName,
      date: { $gte: start, $lte: end },
    };

    // 🔹 Add status filter if provided and not "All Status"
    if (status && status !== "All Status") {
      query.status = status;
    }

    const records = await Attendance.find(query).sort({ date: -1 });

    res.status(200).json(records);
  } catch (err) {
    console.error("Error filtering attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
};
