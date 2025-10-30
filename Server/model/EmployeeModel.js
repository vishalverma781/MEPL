import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: { type: String },
  dob: { type: Date },
  city: { type: String },
  state: { type: String },
  street: { type: String },
  profilePic: { type: String },
  qualification: { type: String },
  university: { type: String },
  passingYear: { type: String },
  designation: { type: String },
  department: { type: String },
  joinDate: { type: Date },
  employeeId: { type: String, unique: true },
  password: { type: String, required: true },
  bankName: { type: String },
  accountNumber: { type: String },
  ifsc: { type: String },
}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);
