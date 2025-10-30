import Payroll from "../model/PayrollModel.js";

export const createPayroll = async (req, res) => {
  try {
    const newPayroll = new Payroll(req.body);
    await newPayroll.save();
    res.status(201).json(newPayroll);
  } catch (err) {
    res.status(500).json({ message: "Failed to create payroll", error: err });
  }
};

export const getAllPayrolls = async (req, res) => {
  try {
    const { username, fullName, role } = req.query;

    let filter = {};
    if (role === "employee" && username && fullName) {
      // Employee role ke liye sirf apna payroll
      filter = {
        $and: [{ username }, { fullName }],
      };
    }

    const payrolls = await Payroll.find(filter).sort({ createdAt: -1 });
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payrolls", error: err });
  }
};

export const updatePayroll = async (req, res) => {
  try {
    const updated = await Payroll.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update payroll", error: err });
  }
};

export const deletePayroll = async (req, res) => {
  try {
    await Payroll.findByIdAndDelete(req.params.id);
    res.json({ message: "Payroll deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete payroll", error: err });
  }
};
