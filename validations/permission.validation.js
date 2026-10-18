const { body, param } = require("express-validator");

/**
 * Create Permission Validation
 */
const createPermissionValidation = [
    body("module_name")
        .trim()
        .notEmpty()
        .withMessage("Module name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Module name must be between 2 and 100 characters."),
        // .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ .'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)
        // .withMessage(
        //     "Name can contain only letters, spaces, dots, apostrophes and hyphens."
        // ),

    body("permission_key")
        .trim()
        .customSanitizer((value) => value.toLowerCase())
        .notEmpty()
        .withMessage("Permission key is required.")
        .matches(/^[a-z]+(\.[a-z]+)+$/)
        .withMessage(
            "Permission key must be in format like 'role.create' or 'user.view'."
        ),

    body("permission_name")
        .trim()
        .notEmpty()
        .withMessage("Permission name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Permission name must be between 2 and 100 characters."),
        // .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ .'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)
        // .withMessage(
        //     "Name can contain only letters, spaces, dots, apostrophes and hyphens."
        // ),

];

/**
 * Update Permission Validation
 */
const updatePermissionValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid permission id."),

    body("module_name")
        .trim()
        .notEmpty()
        .withMessage("Module name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Module name must be between 2 and 100 characters."),
        // .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ .'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)
        // .withMessage(
        //     "Name can contain only letters, spaces, dots, apostrophes and hyphens."
        // ),

    body("permission_key")
        .trim()
        .notEmpty()
        .withMessage("Permission key is required.")
        .matches(/^[a-z]+(\.[a-z]+)+$/)
        .withMessage(
            "Permission key must be in format like 'role.create' or 'user.view'."
        ),

    body("permission_name")
        .trim()
        .notEmpty()
        .withMessage("Permission name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Permission name must be between 2 and 100 characters."),
        // .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ .'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)
        // .withMessage(
        //     "Name can contain only letters, spaces, dots, apostrophes and hyphens."
        // ),
];

/**
 * Permission ID Validation
 */
const permissionIdValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid permission id."),
];

module.exports = {
    createPermissionValidation,
    updatePermissionValidation,
    permissionIdValidation,
};