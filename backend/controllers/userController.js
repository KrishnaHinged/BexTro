import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Only JPEG/JPG/PNG images are allowed!"));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
}).single("profilePhoto");

export const register = async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        
        const { fullName, username, password, confirmpassword, gender } = req.body;

        if (!fullName || !username || !password || !confirmpassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const userExists = await User.findOne({ username: username.trim() });
        if (userExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password.trim(), salt);

        const profilePhoto = `https://avatar.iran.liara.run/public/${gender === "Male" ? "boy" : "girl"}?username=${username.trim()}`;

        const newUser = await User.create({
            fullName,
            username: username.trim(),
            password: hashedPassword,
            profilePhoto,
            gender,
            score: 0,
        });

        console.log("User Created Successfully:", newUser);

        return res.status(201).json({ message: "User registered successfully", success: true });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ username: username.trim() });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY is not set");
        }

        const token = jwt.sign({ userId: user._id, role: user.role  }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful",
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                profilePhoto: user.profilePhoto,
                score: user.score,
                role:user.role
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getOtherUsers = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const otherUsers = await User.find({ _id: { $ne: req.userId } }).select("-password");

        return res.status(200).json(otherUsers);
    } catch (error) {
        console.error("Get Other Users Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getProfile = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Get Profile Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.error("Multer Error:", err.message);
                return res.status(400).json({ message: err.message });
            }

            if (!req.userId) {
                return res.status(401).json({ message: "Unauthorized access" });
            }

            const { fullName, username, score } = req.body;

            if (!fullName || !username) {
                return res.status(400).json({ message: "Full name and username are required" });
            }

            const existingUser = await User.findOne({ username: username.trim(), _id: { $ne: req.userId } });
            if (existingUser) {
                return res.status(400).json({ message: "Username already exists" });
            }

            const updateData = {
                fullName,
                username: username.trim(),
            };

            if (req.file) {
                updateData.profilePhoto = `/uploads/${req.file.filename}`;
            }
            if (score !== undefined) {
                updateData.score = Number(score);
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.userId,
                updateData,
                { new: true, runValidators: true }
            ).select("-password");

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const updateScore = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const { score } = req.body;
        if (score === undefined || isNaN(score)) {
            return res.status(400).json({ message: "Valid score required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { score: Number(score) },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Score updated", user: updatedUser });
    } catch (error) {
        console.error("Update Score Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};