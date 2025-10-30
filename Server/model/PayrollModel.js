import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String },
  bankName: { type: String },
  accountNumber: { type: String },
  ifsc: { type: String },
  department: { type: String },
  month: { type: String, required: true },
  date: { type: String, required: true },
  leaves: { type: Number, default: 0 },
  salary: { type: Number, required: true },
  expense: { type: Number, default: 0 },
  markedBy: { type: String, default: "Admin" },
}, { timestamps: true });

export default mongoose.model("Payroll", payrollSchema);
