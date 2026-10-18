const { body, param } = require("express-validator");

/**
 * Create Role Validation
 */
const createRoleValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Role name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Role name must be between 2 and 100 characters."),
        // .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ .'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)
        // .withMessage(
        //     "Name can contain only letters, spaces, dots, apostrophes and hyphens."
        // ),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required.")
        .isLength({ min: 5, max: 200 })
        .withMessage("Description must be between 5 and 200 characters."),
        // .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ .'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)
        // .withMessage(
        //     "Name can contain only letters, spaces, dots, apostrophes and hyphens."
        // ),

    body("status")
        .optional()
        // .customSanitizer((value) => value.toLowerCase())
        .isIn(["active", "inactive"])
        .withMessage("Status must be active or inactive."),
];

/**
 * Update Role Validation
 */
const updateRoleValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid role id."),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Role name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Role name must be between 2 and 100 characters."),
        // .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ .'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)
        // .withMessage(
        //     "Name can contain only letters, spaces, dots, apostrophes and hyphens."
        // ),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required.")
        .isLength({ min: 5, max: 200 })
        .withMessage("Description must be between 5 and 200 characters."),
        // .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ .'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)
        // .withMessage(
        //     "Name can contain only letters, spaces, dots, apostrophes and hyphens."
        // ),

    body("status")
        .optional()
        // .customSanitizer((value) => value.toLowerCase())
        .isIn(["active", "inactive"])
        .withMessage("Status must be active or inactive."),
];

/**
 * Update Status Validation
 */
const updateStatusValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid role id."),

    body("status")
        .notEmpty()
        .withMessage("Status is required.")
        .isIn(["active", "inactive"])
        .withMessage("Status must be active or inactive."),
];

/**
 * Role ID Validation
 */
const roleIdValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid role id."),
];

module.exports = {
    createRoleValidation,
    updateRoleValidation,
    updateStatusValidation,
    roleIdValidation,
};