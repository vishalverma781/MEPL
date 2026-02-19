import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dotenvVar, init } from "./config.js";

import authRoutes from "./routes/authRoutes.js";
import commonRoutes from "./routes/commonRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import plazaRoutes from "./routes/PlazaRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import employeeDashboardRoutes from "./routes/employeeDashboard.js";
import reportRoutes from "./routes/reportRoutes.js";

import emailRoutes from "./routes/emailRoutes.js";


import path from "path";

const app = express();

// Middleware
app.use(cookieParser());

// JSON parsing
app.use(express.json());

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://employee.mahakalinfra.in",
  "https://mahakalinfra.in",
];


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // ✅ PATCH added
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ headers allow kiye
  })
);

// Serve uploaded files
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user", authRoutes);
app.use("/api/superadmin", commonRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/plazas", plazaRoutes);
app.use("/api/employees", employeeRoutes); 
app.use("/api/roles", roleRoutes);
app.use("/api/allemployees", employeeRoutes); 
app.use("/api/allroles", roleRoutes);         
app.use("/api/issues", issueRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/payrolls", payrollRoutes);
app.use("/api/dashboard", employeeDashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/emails", emailRoutes);

// MongoDB connection
mongoose
  .connect(dotenvVar.MONGODB_URI)
  .then(() => {
    console.log("Connected to DB");
    init();
  })
  .catch((err) => console.error("Database connection error:", err));

// Start server
app.listen(dotenvVar.PORT, () => {
  console.log("Server running on port", dotenvVar.PORT);
});
