import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { createPost, upload, getFeed, getUserPosts, toggleLike, addComment } from '../controllers/postController.js';

const router = express.Router();

// Get the main feed
router.get("/feed", isAuthenticated, getFeed);

// Create a new post / upload proof
router.post("/create", isAuthenticated, upload, createPost);

// Get specific user posts
router.get("/user/:userId", isAuthenticated, getUserPosts);

// Toggle a like
router.post("/:postId/like", isAuthenticated, toggleLike);

// Add a comment
router.post("/:postId/comment", isAuthenticated, addComment);

export default router;
