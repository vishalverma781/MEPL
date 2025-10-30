import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  role: { type: String, required: true },
  assignedProject: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  assignedPlaza: { type: mongoose.Schema.Types.ObjectId, ref: "Plaza" },
  office: { type: String, enum: ["head", "branch", ""], default: "" },
  fromDate: { type: Date, required: true },
  assignBy: {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    username: String, // ✅ only username
  }
}, { timestamps: true });

export default mongoose.model("Role", roleSchema);
