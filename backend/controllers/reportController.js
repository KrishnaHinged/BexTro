import { Report } from "../models/Report.js";
import { User } from "../models/userModel.js";
import { Post } from "../models/Post.js";

export const createReport = async (req, res) => {
    try {
        const { targetType, targetId, reason, description } = req.body;
        const reporterId = req.userId;

        if (!targetType || !targetId || !reason) {
            return res.status(400).json({ message: "Target type, ID and reason are required." });
        }

        const report = await Report.create({
            reporter: reporterId,
            targetType,
            targetId,
            reason,
            description
        });

        return res.status(201).json({ message: "Report submitted successfully.", report });
    } catch (error) {
        console.error("Create Report Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getReports = async (req, res) => {
    try {
        // Only admins should hit this (middleware check in routes)
        const reports = await Report.find()
            .populate("reporter", "username fullName")
            .sort({ createdAt: -1 });

        return res.status(200).json(reports);
    } catch (error) {
        console.error("Get Reports Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const updateReportStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status } = req.body;

        if (!["pending", "resolved", "dismissed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        const report = await Report.findByIdAndUpdate(reportId, { status }, { new: true });
        if (!report) return res.status(404).json({ message: "Report not found." });

        return res.status(200).json({ message: "Report status updated.", report });
    } catch (error) {
        console.error("Update Report Status Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
