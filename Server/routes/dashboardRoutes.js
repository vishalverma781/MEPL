import express from "express";
import Employee from "../model/EmployeeModel.js";
import Project from "../model/ProjectModel.js";
import Plaza from "../model/PlazaModel.js";
import Role from "../model/RoleModel.js";
import Admin from "../model/adminModel.js";

const router = express.Router();

// GET /api/dashboard/counts
router.get("/counts", async (req, res) => {
  try {
    const employees = await Employee.countDocuments();
    const projects = await Project.countDocuments();
    const plazas = await Plaza.countDocuments();
    const roles = await Role.countDocuments();
    const admins = await Admin.countDocuments();

    res.json({
      employees,
      employees,
      projects,
      plazas,
      roles,
      admins
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard counts" });
  }
});

export default router;
