import mongoose from "mongoose";


const roleHistorySchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["site_engineer", "project_incharge", "plaza_incharge"],
    required: true
  },
  assignedEntity: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "roleHistory.assignedEntityType",
    required: true
  },
  assignedEntityType: {
    type: String,
    enum: ["Plaza", "Project"],
    required: true
  },
  from: { type: Date, required: true },
  to: { type: Date } // null means currently active
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phoneNO: { type: Number, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  currentRole: {
    type: String,
    enum: ["site_engineer", "project_incharge", "plaza_incharge"],
    required: true
  },

  address: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    homeAddress: { type: String, required: true }
  },

  isActive: { type: Boolean, default: true },

  permissions: {
    type: [String],
    default: []
  },
currentPlaza:{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Plaza'
},

currentProject:{
 type: mongoose.Schema.Types.ObjectId,
  ref: 'Project'
  
} ,
  roleHistory: [roleHistorySchema],

  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "assignedByModel",
    required: true
  },
  assignedByModel: {
    type: String,
    enum: ["Admin", "SuperAdmin", "ProjectIncharge"],
    required: true
  }
}, { timestamps: true });

const User= mongoose.model("User", userSchema)
const RoleHistory= mongoose.model("History", roleHistorySchema)

export {User, RoleHistory}
