const {
    createRole,
    findRoleByName,
    findRoleById,
    getRoles,
    updateRole,
    deleteRole,
} = require("../services/role.services");

class RoleController {

    /**
     * Create Role
     */
    static async create(req, res) {

        try {

            const {
                name,
                description,
                status,
            } = req.body;

            const roleExists = await findRoleByName(name);

            if (roleExists) {
                return res.status(409).json({
                    success: false,
                    message: "Role already exists.",
                });
            }

            const role = await createRole({
                name,
                description,
                status: status || "active",
            });

            return res.status(201).json({
                success: true,
                message: "Role created successfully.",
                data: role,
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
     * Get Roles
     */
    // static async list(req, res) {

    //     try {

    //         const {
    //             page = 1,
    //             limit = 10,
    //             search = "",
    //             sortBy = "created_at",
    //             sortOrder = "DESC",
    //         } = req.query;

    //         const result = await getRoles({
    //             page,
    //             limit,
    //             search,
    //             sortBy,
    //             sortOrder,
    //         });

    //         return res.status(200).json({
    //             success: true,
    //             message: "Roles fetched successfully.",
    //             totalRecords: result.count,
    //             totalPages: Math.ceil(result.count / limit),
    //             currentPage: Number(page),
    //             data: result.rows,
    //         });

    //     } catch (error) {

    //         console.error(error);

    //         return res.status(500).json({
    //             success: false,
    //             message: error.message,
    //         });

    //     }

    // }
   static async list(req, res) {

    try {

        const {
            page = 1,
            limit = 10,
            search = "",
            sortBy = "created_at",
            sortOrder = "DESC",
        } = req.query;

        const result = await getRoles({

            page: Number(page),

            limit: Number(limit),

            search,

            sortBy,

            sortOrder,

        });

        return res.status(200).json({

            success: true,

            message: "Roles fetched successfully.",

            totalRecords: result.count,

            totalPages: Math.ceil(
                result.count / Number(limit)
            ),

            currentPage: Number(page),

            data: result.rows,

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
     * Get Role By Id
     */
    // static async getById(req, res) {

    //     try {

    //         const role = await findRoleById(req.params.id);

    //         if (!role) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Role not found.",
    //             });
    //         }

    //         return res.status(200).json({
    //             success: true,
    //             data: role,
    //         });

    //     } catch (error) {

    //         console.error(error);

    //         return res.status(500).json({
    //             success: false,
    //             message: error.message,
    //         });

    //     }

    // }
    static async getById(req, res) {

        try {

            const role = await findRoleById(req.params.id);

            if (!role) {

                return res.status(404).json({
                    success: false,
                    message: "Role not found.",
                });

            }

            const roleData = role.toJSON();

            roleData.permissionCount =
                roleData.permissions?.length || 0;

            return res.status(200).json({

                success: true,

                data: roleData,

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
     * Update Role
     */
    static async update(req, res) {

        try {

            const role = await findRoleById(req.params.id);

            if (!role) {

                return res.status(404).json({
                    success: false,
                    message: "Role not found.",
                });

            }
            const name=req.body.name

            const duplicateRole = await findRoleByName(name);

            if (duplicateRole) {

                return res.status(409).json({
                    success: false,
                    message: "Role already exists.",
                });

            }

            await updateRole(role, {
                name: req.body.name,
                description: req.body.description,
                status: req.body.status,
            });

            return res.status(200).json({
                success: true,
                message: "Role updated successfully.",
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
     * Update Status
     */
    // static async updateStatus(req, res) {

    //     try {

    //         const role = await findRoleById(req.params.id);

    //         if (!role) {

    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Role not found.",
    //             });

    //         }

    //         await updateRole(role, {
    //             status: req.body.status,
    //         });

    //         return res.status(200).json({
    //             success: true,
    //             message: "Role status updated successfully.",
    //         });

    //     } catch (error) {

    //         console.error(error);

    //         return res.status(500).json({
    //             success: false,
    //             message: error.message,
    //         });

    //     }

    // }

    /**
     * Delete Role (Soft Delete)
     */
    static async delete(req, res) {

        try {

            const role = await findRoleById(req.params.id);

            if (!role) {

                return res.status(404).json({
                    success: false,
                    message: "Role not found.",
                });

            }

            await deleteRole(role);

            return res.status(200).json({
                success: true,
                message: "Role deleted successfully.",
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

module.exports = RoleController;