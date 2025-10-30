import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
  issueId: { type: Number, unique: true }, // <-- naya field
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  reporterUsername: { type: String, required: true },
  reporterFullName: { type: String },
   reporterOffice: { type: String, default: "Not Assigned" }, 
  plazaName: { type: String, default: "N/A" },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  time: { type: String },
  status: { type: String, enum: ["Pending", "Solved", "Resolved"], default: "Pending" },
  remarks: { type: String, default: "" },
   rectifiedDate: { type: Date }, // ✅ naya field add kiya
}, { timestamps: true });

// Auto increment issueId starting from 101
IssueSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastIssue = await this.constructor.findOne({}).sort({ issueId: -1 });
    this.issueId = lastIssue ? lastIssue.issueId + 1 : 101;
  }
  next();
});

export default mongoose.model("Issue", IssueSchema);
