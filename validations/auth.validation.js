const { body } = require("express-validator");

const signupValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ min: 3, max: 100 })
        .withMessage("Name must be between 3 and 100 characters."),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .normalizeEmail(),

    body("mobile")
        .trim()
        .notEmpty()
        .withMessage("Mobile number is required.")
        .isLength({ min: 10, max: 15 })
        .withMessage("Mobile number must be between 10 and 15 digits.")
        .isNumeric()
        .withMessage("Mobile number must contain only numbers."),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters."),

    body("role_id")
        .notEmpty()
        .withMessage("Role is required.")
        .isInt({ min: 1 })
        .withMessage("Invalid role."),
];

const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required."),
];
const forgotPasswordValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .normalizeEmail(),
];

/**
 * Verify OTP Validation
 */
const verifyOtpValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .normalizeEmail(),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required.")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits.")
        .isNumeric()
        .withMessage("OTP must contain only numbers."),
];

/**
 * Reset Password Validation
 */
const resetPasswordValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .normalizeEmail(),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required.")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits.")
        .isNumeric()
        .withMessage("OTP must contain only numbers."),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be between 8 and 20 characters.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).+$/)
        .withMessage(
            "Password must contain uppercase, lowercase, number and special character."
        ),

    body("confirm_password")
        .notEmpty()
        .withMessage("Confirm password is required.")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password and confirm password do not match.");
            }
            return true;
        }),
];

/**
 * Change Password Validation
 */
const changePasswordValidation = [
    body("old_password")
        .notEmpty()
        .withMessage("Old password is required."),

    body("new_password")
        .notEmpty()
        .withMessage("New password is required.")
        .isLength({ min: 8, max: 20 })
        .withMessage("New password must be between 8 and 20 characters.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).+$/)
        .withMessage(
            "New password must contain uppercase, lowercase, number and special character."
        ),

    body("confirm_password")
        .notEmpty()
        .withMessage("Confirm password is required.")
        .custom((value, { req }) => {
            if (value !== req.body.new_password) {
                throw new Error("New password and confirm password do not match.");
            }
            return true;
        }),
];
module.exports = {
    signupValidation,
    loginValidation,
    forgotPasswordValidation,
    verifyOtpValidation,
    resetPasswordValidation,
    changePasswordValidation,
};