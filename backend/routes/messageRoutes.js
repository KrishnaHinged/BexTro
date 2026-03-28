import express from "express";
import { getMessage, sendMessage, sendCommunityMessage, getCommunityMessages } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated,sendMessage);
router.route("/:id").get(isAuthenticated, getMessage);

router.route("/community/send/:id").post(isAuthenticated, sendCommunityMessage);
router.route("/community/:id").get(isAuthenticated, getCommunityMessages);

export default router;

