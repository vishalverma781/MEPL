import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    default: "SuperAdmin"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  permissions: { 
    type: [String], 
    default: ["manage_users", "manage_projects", "manage_plazas", "manage_issues", "configure_system"] 
  },
  // 🔹 Add login logs
  loginLogs: [
    {
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

export default SuperAdmin;
