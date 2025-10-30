// routes/reportRoutes.js
import express from "express";
import { sendReportEmail } from "../utils/sendReportEmail.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: "No emails provided" });
    }
    await sendReportEmail(emails);
    res.json({ message: "Email sent (or triggered) successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send report" });
  }
});

export default router;
