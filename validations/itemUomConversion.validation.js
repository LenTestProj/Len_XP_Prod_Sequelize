const { body } = require("express-validator");

/**
 * Create Item UOM Conversion Validation
 */
const createValidation = [

    body("item_id")
        .notEmpty()
        .withMessage("Item is required.")
        .isInt({ min: 1 })
        .withMessage("Invalid item."),

    body("from_uom_id")
        .notEmpty()
        .withMessage("From UOM is required.")
        .isInt({ min: 1 })
        .withMessage("Invalid From UOM."),

    body("to_uom_id")
        .notEmpty()
        .withMessage("To UOM is required.")
        .isInt({ min: 1 })
        .withMessage("Invalid To UOM."),

    body("conversion_factor")
        .notEmpty()
        .withMessage("Conversion factor is required.")
        .isFloat({ gt: 0 })
        .withMessage("Conversion factor must be greater than zero."),

    body("is_purchase_conversion")
        .optional()
        .isBoolean()
        .withMessage("Purchase conversion must be true or false."),

    body("is_production_conversion")
        .optional()
        .isBoolean()
        .withMessage("Production conversion must be true or false."),

    body("effective_from")
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601()
        .withMessage("Effective From must be a valid date.")
        .toDate(),

    body("effective_to")
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601()
        .withMessage("Effective To must be a valid date.")
        .toDate(),

    body("effective_to").custom((value, { req }) => {

        if (
            req.body.effective_from &&
            value &&
            new Date(value) < new Date(req.body.effective_from)
        ) {
            throw new Error(
                "Effective To must be greater than or equal to Effective From."
            );
        }

        return true;

    }),

];

/**
 * Update Validation
 */
const updateValidation = [

    body("item_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid item."),

    body("from_uom_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid From UOM."),

    body("to_uom_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid To UOM."),

    body("conversion_factor")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Conversion factor must be greater than zero."),

    body("is_purchase_conversion")
        .optional()
        .isBoolean()
        .withMessage("Purchase conversion must be true or false."),

    body("is_production_conversion")
        .optional()
        .isBoolean()
        .withMessage("Production conversion must be true or false."),

    body("effective_from")
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601()
        .withMessage("Effective From must be a valid date.")
        .toDate(),

    body("effective_to")
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601()
        .withMessage("Effective To must be a valid date.")
        .toDate()
        .custom((value, { req }) => {

            if (
                req.body.effective_from &&
                value &&
                new Date(value) < new Date(req.body.effective_from)
            ) {
                throw new Error(
                    "Effective To must be greater than or equal to Effective From."
                );
            }

            return true;
        }),

];

module.exports = {

    createValidation,

    updateValidation,

};