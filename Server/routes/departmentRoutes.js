import express from "express";
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controller/departmentController.js";

const router = express.Router();

// CRUD routes
router.get("/", getDepartments);
router.post("/", addDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;
