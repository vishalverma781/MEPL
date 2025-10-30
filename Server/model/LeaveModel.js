import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numberOfDays: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    username: { type: String, required: true },
    fullName: { type: String, required: true },
    appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, // ✅ important
  },
  { timestamps: true }
);

export default mongoose.model("Leave", leaveSchema);
