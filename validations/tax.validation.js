const { body } = require("express-validator");

/**
 * Create Tax Validation
 */
const createTaxValidation = [

    body("hsn_code")
        .trim()
        .notEmpty()
        .withMessage("HSN Code is required.")
        .isLength({ min: 2, max: 20 })
        .withMessage("HSN Code must be between 2 and 20 characters."),

    body("tax_type")
        .notEmpty()
        .withMessage("Tax type is required.")
        .isIn([
            "GST",
            "VAT",
            "SERVICE_TAX",
            "EXCISE",
            "CESS",
            "CUSTOM_DUTY",
            "OTHER",
        ])
        .withMessage("Invalid tax type."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required.")
        .isLength({ max: 255 })
        .withMessage("Description must not exceed 255 characters."),

    body("cgst")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("CGST must be between 0 and 100."),

    body("sgst")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("SGST must be between 0 and 100."),

    body("igst")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("IGST must be between 0 and 100."),

    body("status")
        .optional()
        .isIn(["active", "inactive"])
        .withMessage("Status must be active or inactive."),
];

/**
 * Update Tax Validation
 */
const updateTaxValidation = [

    body("hsn_code")
        .trim()
        .notEmpty()
        .withMessage("HSN Code is required.")
        .isLength({ min: 2, max: 20 })
        .withMessage("HSN Code must be between 2 and 20 characters."),

    body("tax_type")
        .notEmpty()
        .withMessage("Tax type is required.")
        .isIn([
            "GST",
            "VAT",
            "SERVICE_TAX",
            "EXCISE",
            "CESS",
            "CUSTOM_DUTY",
            "OTHER",
        ])
        .withMessage("Invalid tax type."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required."),

    body("cgst")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("CGST must be between 0 and 100."),

    body("sgst")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("SGST must be between 0 and 100."),

    body("igst")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("IGST must be between 0 and 100."),

    body("status")
        .notEmpty()
        .withMessage("Status is required.")
        .isIn(["active", "inactive"])
        .withMessage("Status must be active or inactive."),
];

module.exports = {
    createTaxValidation,
    updateTaxValidation,
};