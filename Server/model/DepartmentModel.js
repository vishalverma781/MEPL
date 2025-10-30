import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employees: { type: Number, default: 0 },
});

export default mongoose.model("Department", DepartmentSchema);
