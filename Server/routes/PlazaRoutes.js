import express from "express";
import { getAllPlazas, addPlaza, deletePlaza } from "../controller/plazaController.js";

const router = express.Router();

// ✅ Get all plazas
router.get("/", getAllPlazas);

// ✅ Add new plaza
router.post("/", addPlaza);

// ✅ Delete plaza
router.delete("/:id", deletePlaza);

export default router;
