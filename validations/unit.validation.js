const { body } = require("express-validator");
const { Units,Items } = require("../models");

/**
 * Create Unit Validation
 */
const createUnitValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Unit name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Unit name must be between 2 and 100 characters."),

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Unit code is required.")
        .isLength({ min: 1, max: 20 })
        .withMessage("Unit code must be between 1 and 20 characters."),
    
    body("status")
        .optional()
        // .customSanitizer((value) => value.toLowerCase())
        .isIn(["active", "inactive"])
        .withMessage("Status must be active or inactive."),
    body("dimension")
        .optional()
        .isIn([ "MASS","VOLUME","COUNT","LENGTH","AREA","OTHER"])
        .withMessage("Dimension must be mass,volume,count,length,area or other."),
    body("decimal_places")
    .optional()
    .isInt({ min: 0, max: 6 })
    .withMessage("Decimal places must be an integer between 0 and 6.")
    .toInt(),
];

/**
 * Update Unit Validation
 */
const updateUnitValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Unit name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Unit name must be between 2 and 100 characters."),

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Unit code is required.")
        .isLength({ min: 1, max: 20 })
        .withMessage("Unit code must be between 1 and 20 characters."),

    body("status")
        .notEmpty()
        // .customSanitizer((value) => value.toLowerCase())
        .isIn(["active", "inactive"])
        .withMessage("Status must be active or inactive."),
    body("dimension")
        .optional()
        .isIn([ "MASS","VOLUME","COUNT","LENGTH","AREA","OTHER"])
        .withMessage("Dimension must be mass,volume,count,length,area or other."),
    body("decimal_places")
        .optional()
        .isInt({ min: 0, max: 6 })
        .withMessage("Decimal places must be an integer between 0 and 6.")
        .toInt(),
];

module.exports = {
    createUnitValidation,
    updateUnitValidation,
};