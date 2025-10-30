import express from "express";
import { saveEmails, removeEmail, getEmails } from "../controller/emailController.js";

const router = express.Router();

router.post("/save", saveEmails);
router.post("/remove", removeEmail);
router.get("/:projectId", getEmails);

export default router;
