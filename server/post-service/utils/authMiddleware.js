//post-service/utils/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN); // Verify token
        req.user = decoded; // Attach user info to the request
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.error("Token verification failed:", error.message); // Log error
        return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }
};

module.exports = authMiddleware;


