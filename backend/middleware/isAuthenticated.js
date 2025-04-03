import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const isAuthenticated = (req, res, next) => {
    try {
        if (!req.cookies || !req.cookies.token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export default isAuthenticated;

// ||

// import jwt from "jsonwebtoken";
// import { User } from "../models/userModel.js";

// const isAuthenticated = async (req, res, next) => {
//     try {
//         if (!req.cookies || !req.cookies.token) {
//             return res.status(401).json({ error: "No token provided" });
//         }

//         const token = req.cookies.token;
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//         const user = await User.findById(decoded.userId); // Fetch full user details
//         if (!user) return res.status(401).json({ error: "User not found" });

//         req.user = {
//             id: user._id,
//             role: user.role,  // Store role in request object
//         };

//         next();
//     } catch (error) {
//         console.error("Authentication Error:", error.message);
//         return res.status(401).json({ error: "Invalid or expired token" });
//     }
// };

// export default isAuthenticated;
