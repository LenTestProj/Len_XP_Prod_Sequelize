const { verifyToken } = require("../helpers/jwt.helper");
const { findUserById } = require("../services/auth.service");

const authMiddleware = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required.",
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format.",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token);

        const user = await findUserById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        if (user.is_deleted) {
            return res.status(401).json({
                success: false,
                message: "User has been deleted.",
            });
        }

        if (user.status !== "active") {
            return res.status(401).json({
                success: false,
                message: "User is inactive.",
            });
        }

        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });

    }
};

module.exports = authMiddleware;