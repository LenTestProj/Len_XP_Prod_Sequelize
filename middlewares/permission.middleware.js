// const { getUserPermissions } = require("../services/auth.service");

// const authorize = (...permissions) => {

//     return async (req, res, next) => {

//         try {

//             const user = await getUserPermissions(req.user.id);

//             if (!user) {

//                 return res.status(401).json({

//                     success: false,

//                     message: "Unauthorized.",

//                 });

//             }

//             const userPermissions =
//                 user.role.permissions.map(item => item.permission_key);

//             const hasPermission =
//                 permissions.some(permission =>
//                     userPermissions.includes(permission)
//                 );

//             if (!hasPermission) {

//                 return res.status(403).json({

//                     success: false,

//                     message: "Permission denied.",

//                 });

//             }

//             next();

//         }

//         catch (error) {

//             return res.status(500).json({

//                 success: false,

//                 message: error.message,

//             });

//         }

//     };

// };

// module.exports = authorize;
const { getUserPermissions } = require("../services/auth.service");

const authorize = (...permissions) => {

    return async (req, res, next) => {

        try {

            const user = await getUserPermissions(req.user.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized.",
                });
            }

            /**
             * Super Admin has access to everything.
             * No need to assign permissions manually.
             */
            if (
                user.role &&
                user.role.name &&
                user.role.name === "SuperAdmin"
            ) {
                return next();
            }

            const userPermissions =
                (user.role.permissions || []).map(
                    permission => permission.permission_key
                );

            const hasPermission = permissions.some(permission =>
                userPermissions.includes(permission)
            );

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: "Permission denied.",
                });
            }

            next();

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }

    };

};

module.exports = authorize;