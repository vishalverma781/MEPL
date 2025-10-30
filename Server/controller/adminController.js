import Admin from "../model/adminModel.js";
import authEssentials from "./index.js"; // for password hashing
import { dotenvVar } from "../config.js";

const adminCtrl = {

  // CREATE new Admin
  createAdmin: async (req, res) => {
    try {
      const { firstName, lastName, username, password, email, role, address, position } = req.body;

      if (!firstName || !lastName || !username || !password || !email || !address?.city || !address?.state || !address?.homeAddress) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Hash password
      const hash = await authEssentials.createHash(password, dotenvVar.SALT);

      const newAdmin = new Admin({
        firstName,
        lastName,
        username,
        password: hash,
        email,
        role: role || "Admin",
        address,
        position: position || "N/A", // ✅ Added position
        assignedBy: req.user.user // Admin creating this admin
      });

      await newAdmin.save();
      res.status(201).json({ message: "Admin created successfully", newAdmin });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // GET all Admins
  getAllAdmins: async (req, res) => {
    try {
      const admins = await Admin.find().populate("assignedBy", "username email");
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // UPDATE Admin
  updateAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Optional: hash password if updating
      if (updates.password) {
        updates.password = await authEssentials.createHash(updates.password, dotenvVar.SALT);
      }

      // ✅ Ensure position can be updated without affecting other fields
      const updatedAdmin = await Admin.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

      if (!updatedAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.status(200).json({ message: "Admin updated successfully", updatedAdmin });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // DELETE Admin
  deleteAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedAdmin = await Admin.findByIdAndDelete(id);

      if (!deletedAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.status(200).json({ message: "Admin deleted successfully" });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

};

export default adminCtrl;
