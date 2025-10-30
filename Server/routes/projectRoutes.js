import express from "express";
import {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controller/projectController.js";

const router = express.Router();

router.post("/", addProject);        // ➕ Add
router.get("/", getProjects);        // 📋 Get All
router.get("/:id", getProjectById);  // 👁️ Get Single
router.put("/:id", updateProject);   // ✏️ Update
router.delete("/:id", deleteProject); // 🗑️ Delete

export default router;
