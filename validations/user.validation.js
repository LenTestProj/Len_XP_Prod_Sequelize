const { body, param } = require("express-validator");

/**
 * Create User
 */
const createUserValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters."),
       

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email address.")
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
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be between 8 and 20 characters.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).+$/)
        .withMessage(
            "Password must contain uppercase, lowercase, number and special character."
        ),

    body("role_id")
        .notEmpty()
        .withMessage("Role is required.")
        .isInt({ min: 1 })
        .withMessage("Invalid role id."),
    body("organisation_id")
    .exists({ checkFalsy: true })
    .withMessage("Organisation is required.")
    .isInt({ min: 1 })
    .withMessage("Invalid organisation id.")
    .toInt(),

    body("status")
        .optional()
        // .customSanitizer((value) => value.toLowerCase())
        .isIn(["active", "inactive"])
        .withMessage("Status must be active or inactive."),

];

/**
 * Update  User
 */
const updateUserValidation = [

    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid user id."),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters."),
        // .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ .'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)
        // .withMessage(
        //     "Name can contain only letters, spaces, dots, apostrophes and hyphens."
        // ),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email address.")
        .normalizeEmail(),
    body("mobile")
        .trim()
        .notEmpty()
        .withMessage("Mobile number is required.")
        .isLength({ min: 10, max: 15 })
        .withMessage("Mobile number must be between 10 and 15 digits.")
        .isNumeric()
        .withMessage("Mobile number must contain only numbers."),

    body("role_id")
        .notEmpty()
        .withMessage("Role is required.")
        .isInt({ min: 1 })
        .withMessage("Invalid role id."),
    body("organisation_id")
        .exists({ checkFalsy: true })
        .withMessage("Organisation is required.")
        .isInt({ min: 1 })
        .withMessage("Invalid organisation id.")
        .toInt(),
    body("status")
        .optional()
        // .customSanitizer((value) => value.toLowerCase())
        .isIn(["active", "inactive"])
        .withMessage("Status must be active or inactive."),

];

/**
 * Update Status
 */
const updateStatusValidation = [

    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid user id."),

    body("status")
        .notEmpty()
        .withMessage("Status is required.")
        .isIn(["active", "inactive"])
        .withMessage("Status must be active or inactive."),

];

/**
 * User Id Validation
 */
const userIdValidation = [

    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid user id."),

];

module.exports = {

    createUserValidation,

    updateUserValidation,

    updateStatusValidation,

    userIdValidation,

};