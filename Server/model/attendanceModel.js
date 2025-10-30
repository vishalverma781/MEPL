import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "On Leave", "WFH"],
      default: "Present",
    },
    markedBy: {
      type: String,
      required: [true, "MarkedBy is required"],
    },
    date: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt automatically
);

export default mongoose.model("Attendance", attendanceSchema);
