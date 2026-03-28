import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js";
import { createReport, getReports, updateReportStatus } from "../controllers/reportController.js";

const router = express.Router();

// Publicly report something (must be logged in)
router.post("/create", isAuthenticated, createReport);

// Admin-only: View and manage reports
router.get("/", isAuthenticated, isAdmin, getReports);
router.patch("/:reportId", isAuthenticated, isAdmin, updateReportStatus);

export default router;
