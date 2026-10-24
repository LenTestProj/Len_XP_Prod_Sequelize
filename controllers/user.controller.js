const bcrypt = require("bcrypt");

const {
    createUser,
    findUserById,
    findUserByEmail,
    findUserByMobile,
    findRoleById,
    getUsers,
    updateUser,
    updateStatus,
    deleteUser,
} = require("../services/user.service");
const {
    findOrganisationById
} = require("../services/organisation.service");
const { sendUserCredentialsMail } = require("../services/mail.service");

class UserController {

    /**
     * Create User
     */
    static async create(req, res) {

        try {

            const {
                name,
                email,
                mobile,
                password,
                role_id,
                organisation_id,
                status,
            } = req.body;

            const emailExists = await findUserByEmail(email);

            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists.",
                });
            }

            const mobileExists = await findUserByMobile(mobile);

            if (mobileExists) {
                return res.status(409).json({
                    success: false,
                    message: "Mobile already exists.",
                });
            }

            const role = await findRoleById(role_id);

            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: "Role not found.",
                });
            }

            if (role.is_deleted) {
                return res.status(400).json({
                    success: false,
                    message: "Selected Role is Deleted.",
                });
            }

            // if (role.status !== "active") {
            //     return res.status(400).json({
            //         success: false,
            //         message: "Selected Role is Inactive.",
            //     });
            // }
            const organisation = await findOrganisationById(organisation_id);

            if (!organisation) {
                return res.status(404).json({
                    success: false,
                    message: "Organisation not found or has been deleted.",
                });
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await createUser({

                name,

                email,

                mobile,

                password: hashedPassword,

                role_id,

                organisation_id,

                passwordExpiry: new Date(Date.now() + 60 * 60 * 1000),

                status: status || "active",

                created_by: req.user.id,

            });
            try {

                await sendUserCredentialsMail(
                    email,
                    name,
                    password
                );

            } catch (err) {

                console.error("Credential email failed:", err);

            }
            return res.status(201).json({

                success: true,

                message: " User created successfully.",

                data: user,

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
     * User List
     */
    static async list(req, res) {

        try {

            const {
                page = 1,
                limit = 10,
                search = "",
                status = "",
                roleId = "",
                sortBy = "created_at",
                sortOrder = "DESC",
            } = req.query;

            const users = await getUsers({

                page,

                limit,

                search,

                status,

                roleId,

                sortBy,

                sortOrder,

            });

            return res.status(200).json({

                success: true,

                totalRecords: users.count,

                totalPages: Math.ceil(users.count / Number(limit)),

                currentPage: Number(page),

                data: users.rows,

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
     * User Details
     */
    static async getById(req, res) {

        try {

            const user = await findUserById(req.params.id);

            if (!user) {

                return res.status(404).json({

                    success: false,

                    message: "User not found.",

                });

            }

            return res.status(200).json({

                success: true,

                data: user,

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
     * Update User
     */
    static async update(req, res) {

        try {

            const user = await findUserById(req.params.id);

            if (!user) {

                return res.status(404).json({

                    success: false,

                    message: "User not found.",

                });

            }

            const emailExists = await findUserByEmail(
                req.body.email,
                req.params.id
            );

            if (emailExists) {

                return res.status(409).json({

                    success: false,

                    message: "Email already exists.",

                });

            }

            const mobileExists = await findUserByMobile(
                req.body.mobile,
                req.params.id
            );

            if (mobileExists) {

                return res.status(409).json({

                    success: false,

                    message: "Mobile already exists.",

                });

            }

            const role = await findRoleById(req.body.role_id);

            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: "Role not found.",
                });
            }

            if (role.is_deleted) {
                return res.status(400).json({
                    success: false,
                    message: "Selected Role is Deleted.",
                });
            }
            const organisation = await findOrganisationById(req.body.organisation_id);

            if (!organisation) {
                return res.status(404).json({
                    success: false,
                    message: "Organisation not found or has been deleted.",
                });
            }

            const updatedUser = await updateUser(
                req.params.id,
                {

                    name: req.body.name,

                    email: req.body.email,

                    mobile: req.body.mobile,

                    role_id: req.body.role_id,

                    organisation_id: req.body.organisation_id,
                    
                    status: req.body.status,

                    updated_by: req.user.id,

                }
            );

            return res.status(200).json({

                success: true,

                message: "User updated successfully.",

                data: updatedUser,

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

    //         const user = await findUserById(req.params.id);

    //         if (!user) {

    //             return res.status(404).json({

    //                 success: false,

    //                 message: "User not found.",

    //             });

    //         }

    //         const updatedUser = await updateStatus(

    //             req.params.id,

    //             req.body.status

    //         );

    //         return res.status(200).json({

    //             success: true,

    //             message: "Status updated successfully.",

    //             data: updatedUser,

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
     * Soft Delete
     */
    static async delete(req, res) {

        try {

            const user = await findUserById(req.params.id);

            if (!user) {

                return res.status(404).json({

                    success: false,

                    message: "User not found.",

                });

            }

            await deleteUser(req.params.id);

            return res.status(200).json({

                success: true,

                message: "User deleted successfully.",

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

module.exports = UserController;