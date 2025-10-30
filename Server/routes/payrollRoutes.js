import express from "express";
import { createPayroll, getAllPayrolls, updatePayroll, deletePayroll } from "../controller/payrollController.js";

const router = express.Router();

router.get("/", getAllPayrolls);
router.post("/", createPayroll);
router.put("/:id", updatePayroll);
router.delete("/:id", deletePayroll);

export default router;
