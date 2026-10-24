const bcrypt = require("bcrypt");
const { sendOtpMail } = require("../services/mail.service");
const {
    findUserByEmail,
    findUserByMobile,
    findRoleById,
    createUser,
    saveOtp,
    verifyOtpForUser,
    clearOtp,
    updatePassword,
    findUserById,
} = require("../services/auth.service");

const { generateToken } = require("../helpers/jwt.helper");

class AuthController {

    /**
     * Signup
     */
    // static async signup(req, res) {

    //     try {

    //         const {
    //             name,
    //             email,
    //             mobile,
    //             password,
    //             role_id,
    //         } = req.body;

    //         // Check email
    //         const emailExists = await findUserByEmail(email);

    //         if (emailExists) {
    //             return res.status(409).json({
    //                 success: false,
    //                 message: "Email already exists.",
    //             });
    //         }

    //         // Check mobile
    //         const mobileExists = await findUserByMobile(mobile);

    //         if (mobileExists) {
    //             return res.status(409).json({
    //                 success: false,
    //                 message: "Mobile number already exists.",
    //             });
    //         }

    //         // Check role
    //         const role = await findRoleById(role_id);

    //         if (!role) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Role not found.",
    //             });
    //         }

    //         // Hash Password
    //         const hashedPassword = await bcrypt.hash(password, 10);

    //         // Create User
    //         const user = await createUser({
    //             name,
    //             email,
    //             mobile,
    //             password: hashedPassword,
    //             role_id,
    //         });

    //         return res.status(201).json({
    //             success: true,
    //             message: "Signup successful.",
    //             data: {
    //                 id: user.id,
    //                 name: user.name,
    //                 email: user.email,
    //                 mobile: user.mobile,
    //                 role_id: user.role_id,
    //             },
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
     * Login
     */
    static async login(req, res) {

        try {

            const {
                email,
                password,
            } = req.body;

            const user = await findUserByEmail(email);
console.log(user,'user')
            if (!user) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password.",
                });

            }

            if (user.status !== "active") {

                return res.status(403).json({
                    success: false,
                    message: "User is inactive.",
                });

            }
            
            const passwordMatched = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatched) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password.",
                });

            }
            if (user.passwordExpiry && new Date() > user.passwordExpiry) {

                return res.status(403).json({

                    success: false,

                    forcePasswordReset: true,

                    message: "Password has expired. Please reset your password.",

                });

            }
            const token = generateToken({

                id: user.id,

                role_id: user.role_id,

                email: user.email,

            });
            return res.status(200).json({

                success: true,

                message: "Login successful.",

                token,

                user: {

                    id: user.id,

                    organisationId:user.organisation_id,

                    name: user.name,

                    email: user.email,

                    mobile: user.mobile,

                    role: user.role,
                    // permissions: user.role?.rolePermissions?.map(
                    //     (rolePermission) => rolePermission.permission
                    // ) || [],

                    permissionCount: user.role?.rolePermissions?.length || 0,

                },

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
     * Forgot Password
     * POST /api/auth/forgot-password
     */
    static async forgotPassword(req, res) {

        try {

            const { email } = req.body;

            const user = await findUserByEmail(email);

            if (!user) {

                return res.status(404).json({
                    success: false,
                    message: "User not found.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Generate 6 Digit OTP
            |--------------------------------------------------------------------------
            */

            const otp = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            /*
            |--------------------------------------------------------------------------
            | OTP Expiry (10 Minutes)
            |--------------------------------------------------------------------------
            */

            const expiry = new Date(
                Date.now() + 10 * 60 * 1000
            );

            /*
            |--------------------------------------------------------------------------
            | Save OTP
            |--------------------------------------------------------------------------
            */

            await saveOtp(
                user.id,
                otp,
                expiry
            );

            /*
            |--------------------------------------------------------------------------
            | TODO
            |--------------------------------------------------------------------------
            | Send OTP using Email/SMS
            |--------------------------------------------------------------------------
            */

            await sendOtpMail(
                user.email,
                user.name,
                otp
            );

            return res.status(200).json({
                success: true,
                message: "OTP sent successfully to your registered email.",
                otp
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
     * Verify OTP
     * POST /api/auth/verify-otp
     */
    static async verifyOtp(req, res) {

        try {

            const {
                email,
                otp,
            } = req.body;

            /*
            |--------------------------------------------------------------------------
            | Verify OTP
            |--------------------------------------------------------------------------
            */

            const user = await verifyOtpForUser(email, otp);

            if (!user) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid or expired OTP.",
                });

            }

            return res.status(200).json({

                success: true,

                message: "OTP verified successfully.",

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
     * Reset Password
     * POST /api/auth/reset-password
    */
    static async resetPassword(req, res) {

        try {

            const {
                email,
                otp,
                password,
            } = req.body;

            /*
            |--------------------------------------------------------------------------
            | Verify OTP
            |--------------------------------------------------------------------------
            */

            const user = await verifyOtpForUser(email, otp);

            if (!user) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid or expired OTP.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Check Old Password
            |--------------------------------------------------------------------------
            */

            const isSamePassword = await bcrypt.compare(
                password,
                user.password
            );

            if (isSamePassword) {

                return res.status(400).json({
                    success: false,
                    message: "New password cannot be the same as the old password.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Hash Password
            |--------------------------------------------------------------------------
            */

            const hashedPassword = await bcrypt.hash(
                password,
                10
            );

            /*
            |--------------------------------------------------------------------------
            | Update Password
            |--------------------------------------------------------------------------
            */

            await updatePassword(user.id, {
                password: hashedPassword,
                passwordExpiry: null,
            });

            /*
            |--------------------------------------------------------------------------
            | Clear OTP
            |--------------------------------------------------------------------------
            */

            await clearOtp(user.id);

            return res.status(200).json({

                success: true,

                message: "Password reset successfully.",

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
     * Change Password
     * POST /api/auth/change-password
     */
    static async changePassword(req, res) {

        try {

            const {
                old_password,
                new_password,
            } = req.body;

            /*
            |--------------------------------------------------------------------------
            | Logged In User
            |--------------------------------------------------------------------------
            */

            const user = await findUserById(req.user.id);

            if (!user) {

                return res.status(404).json({
                    success: false,
                    message: "User not found.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Check Old Password
            |--------------------------------------------------------------------------
            */

            const passwordMatched = await bcrypt.compare(
                old_password,
                user.password
            );

            if (!passwordMatched) {

                return res.status(400).json({
                    success: false,
                    message: "Old password is incorrect.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | New Password Should Not Match Old Password
            |--------------------------------------------------------------------------
            */

            const samePassword = await bcrypt.compare(
                new_password,
                user.password
            );

            if (samePassword) {

                return res.status(400).json({
                    success: false,
                    message: "New password cannot be the same as the old password.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Hash Password
            |--------------------------------------------------------------------------
            */

            const hashedPassword = await bcrypt.hash(
                new_password,
                10
            );

            /*
            |--------------------------------------------------------------------------
            | Update Password
            |--------------------------------------------------------------------------
            */

            await updatePassword(user.id, {
                password: hashedPassword,
                passwordExpiry: null,
            })

            /*
            |--------------------------------------------------------------------------
            | Clear Reset OTP
            |--------------------------------------------------------------------------
            */

            await clearOtp(user.id);

            return res.status(200).json({

                success: true,

                message: "Password changed successfully.",

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

module.exports = AuthController;