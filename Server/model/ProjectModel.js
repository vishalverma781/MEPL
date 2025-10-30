import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  piuName: { type: String, required: true },
  clientName: { type: String, required: true },
  location: { type: String, required: true },
  assignedTo: { type: String, default: "N/A" },
  startDate: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
