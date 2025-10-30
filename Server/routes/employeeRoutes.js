import express from "express";
import {
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  loginEmployee,
} from "../controller/employeeController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Add Employee
router.post("/", upload.single("profilePic"), addEmployee);

// Get all Employees ✅
router.get("/", getEmployees);

// Get single Employee
router.get("/:id", getEmployeeById);

// Update Employee
router.put("/:id", upload.single("profilePic"), updateEmployee);

// Delete Employee
router.delete("/:id", deleteEmployee);

// Employee Login
router.post("/login", loginEmployee);

export default router;
