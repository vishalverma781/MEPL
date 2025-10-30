import express from "express";
import auth from "../middleware/authMiddeleware.js";


import { createIssue, getIssues, resolveIssue } from "../controller/issueController.js";

const router = express.Router();

// Employee ya Admin issue create kar sakte hai
router.post("/", auth, createIssue);

// Employee -> apne issues, Admin -> sab issues
router.get("/", auth, getIssues);

// Issue resolve karna (Employee apna issue, Admin sab)
router.put("/:id/resolve", auth, resolveIssue);

export default router;
