// const authorize = (...roles) => {

//     return async (req, res, next) => {

//         try {

//             if (!req.user) {

//                 return res.status(401).json({
//                     success: false,
//                     message: "Unauthorized.",
//                 });

//             }

//             if (!roles.includes(req.user.role.name)) {

//                 return res.status(403).json({
//                     success: false,
//                     message: "Access denied.",
//                 });

//             }

//             next();

//         } catch (error) {

//             return res.status(500).json({
//                 success: false,
//                 message: error.message,
//             });

//         }

//     };

// };

// module.exports = authorize;
const authorize = (...roles) => {
    return async (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        // Super Admin bypass
        if (
            req.user.role &&
            req.user.role.name &&
            req.user.role.name.toLowerCase() === "super admin"
        ) {
            return next();
        }

        if (!roles.includes(req.user.role.name)) {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        next();
    };
};

module.exports = authorize;