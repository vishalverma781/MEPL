import express from "express";
import { getAllRoles, createRole } from "../controller/roleController.js";

const router = express.Router();

router.get("/", getAllRoles);   // GET all roles
router.post("/", createRole);   // Create new role

export default router;
