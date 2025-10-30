import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName:{
    type: String,
    required: true,
    trim: true
  },
  username: { type: String, required: true, unique: true },
  role: {
    type: String,
    default :"Admin"
  },
  position: { // ✅ Added position
    type: String,
    default: "N/A"
  },
  address: {
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    homeAddress: {
      type: String,
      required: true
    }
  },
  manageIssues: [{
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue'
    }
  }],
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isActive: {
    type: Boolean,
    default: true
  },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "SuperAdmin" },
  permissions: { 
    type: [String], 
    default: ["manage_users", "manage_projects", "manage_plazas", "manage_issues"] 
  }
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
