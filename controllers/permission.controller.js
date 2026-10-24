const {
    createPermission,
    findPermissionById,
    findPermission,
    getPermissions,
    updatePermission,
    deletePermission,
    isPermissionAssigned
} = require("../services/permission.service");

class PermissionController {

    /**
     * Create Permission
     */
    // static async create(req, res) {

    //     try {

    //         const {
    //             module_name,
    //             permission_key,
    //             permission_name,
    //         } = req.body;

    //         const permission = await findPermission({
    //         module_name: module_name.trim(),
    //         permission_key: permission_key.trim().toLowerCase(),
    //         is_deleted: false,
    //     });

    //         if (permission) {
    //             return res.status(409).json({
    //                 success: false,
    //                 message: "Permission already exists.",
    //             });
    //         }

    //         const createdPermission = await createPermission({
    //             module_name: module_name.trim(),
    //             permission_key: permission_key.trim().toLowerCase(),
    //             permission_name: permission_name.trim(),
    //         });

    //         return res.status(201).json({
    //             success: true,
    //             message: "Permission created successfully.",
    //             data: createdPermission,
    //         });

    //     } catch (error) {

    //         console.error(error);

    //         return res.status(500).json({
    //             success: false,
    //             message: error.message,
    //         });

    //     }

    // }
    static async create(req, res) {

        try {

            const {
                module_name,
                permission_key,
                permission_name,
            } = req.body;

            const normalizedModuleName = module_name.trim();

            const normalizedPermissionKey =
                permission_key.trim().toLowerCase();

            const normalizedPermissionName =
                permission_name.trim();

            const permission = await findPermission({

                module_name: normalizedModuleName,

                permission_key: normalizedPermissionKey,

            });
console.log(permission,'permission')
            if (permission) {

                return res.status(409).json({

                    success: false,

                    message: "Permission already exists.",

                });

            }

            const createdPermission = await createPermission({

                module_name: normalizedModuleName,

                permission_key: normalizedPermissionKey,

                permission_name: normalizedPermissionName,

            });

            return res.status(201).json({

                success: true,

                message: "Permission created successfully.",

                data: createdPermission,

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }
    /**
     * Permission List
     */
    static async list(req, res) {

        try {

            const {
                page = 1,
                limit = 10,
                search = "",
                sortBy = "created_at",
                sortOrder = "DESC",
            } = req.query;

            const permissions = await getPermissions({
                page,
                limit,
                search,
                sortBy,
                sortOrder,
            });

            return res.status(200).json({

                success: true,

                message: "Permissions fetched successfully.",

                totalRecords: permissions.count,

                totalPages: Math.ceil(
                    permissions.count / Number(limit)
                ),

                currentPage: Number(page),

                data: permissions.rows,

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

    /**
     * Permission Details
     */
    static async getById(req, res) {

        try {

            const permission = await findPermissionById(
                req.params.id
            );

            if (!permission) {

                return res.status(404).json({

                    success: false,

                    message: "Permission not found.",

                });

            }

            return res.status(200).json({

                success: true,

                data: permission,

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

    /**
     * Update Permission
     */
    static async update(req, res) {

        try {

            const permission = await findPermissionById(
                req.params.id
            );

            if (!permission) {

                return res.status(404).json({

                    success: false,

                    message: "Permission not found.",

                });

            }

            const duplicatePermission = await findPermission({

                module_name: req.body.module_name.trim(),

                permission_key: req.body.permission_key
                    .trim()
                    .toLowerCase(),

                excludeId: req.params.id,

            });

            if (duplicatePermission) {

                return res.status(409).json({

                    success: false,

                    message: "Permission already exists.",

                });

            }

            await updatePermission(permission, {

                module_name: req.body.module_name.trim(),

                permission_key: req.body.permission_key
                    .trim()
                    .toLowerCase(),

                permission_name: req.body.permission_name.trim(),

            });

            return res.status(200).json({

                success: true,

                message: "Permission updated successfully.",

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

    /**
     * Delete Permission
     */
    static async delete(req, res) {

        try {

            const permission = await findPermissionById(
                req.params.id
            );

            if (!permission) {

                return res.status(404).json({

                    success: false,

                    message: "Permission not found.",

                });

            }
            const rolePermission = await isPermissionAssigned(req.params.id);

            if (rolePermission) {

                return res.status(409).json({
                    success: false,
                    message:
                        "Permission is assigned to one or more roles.",
                });

            }
            await deletePermission(permission);

            return res.status(200).json({

                success: true,

                message: "Permission deleted successfully.",

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

}

module.exports = PermissionController;