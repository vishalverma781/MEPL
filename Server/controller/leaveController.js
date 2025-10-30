import Leave from "../model/LeaveModel.js";

// Apply leave
export const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, numberOfDays, reason } = req.body;
    if (!startDate || !endDate || !numberOfDays || !reason) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newLeave = new Leave({
      startDate,
      endDate,
      numberOfDays,
      reason,
      status: "Pending",
      username: req.user.username,
      fullName: req.user.fullName,
      appliedBy: req.user.id, // ✅ token user id
    });

    const saved = await newLeave.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("ApplyLeave Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all leaves (Admin)
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get user leaves
export const getUserLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ appliedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update leave status (Admin)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const leave = await Leave.findById(id);
    if (!leave) return res.status(404).json({ msg: "Leave not found" });

    leave.status = status;
    await leave.save();

    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
