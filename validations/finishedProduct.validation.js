const { body } = require("express-validator");

/**
 * Create Finished Product Validation
 */
const createFinishedProductValidation = [

    body("item_id")
        .notEmpty()
        .withMessage("Item is required.")
        .isInt({ min: 1 })
        .withMessage("Invalid item."),

    body("product_category")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Product category must not exceed 100 characters."),

    body("net_content_value")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage("Net content value must be greater than or equal to 0."),

    body("net_content_uom_id")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("Invalid net content unit."),

    body("default_batch_output_qty")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage("Default batch output quantity must be greater than or equal to 0."),

    body("sale_pack_size")
        .optional({ nullable: true })
        .isFloat({ min: 1 })
        .withMessage("Sale pack size must be greater than or equal to 1."),

    body("quality_check_required")
        .optional()
        .isBoolean()
        .withMessage("Quality check required must be true or false."),
];

/**
 * Update Finished Product Validation
 */
const updateFinishedProductValidation = [

    body("product_category")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Product category must not exceed 100 characters."),

    body("net_content_value")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage("Net content value must be greater than or equal to 0."),

    body("net_content_uom_id")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("Invalid net content unit."),

    body("default_batch_output_qty")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage("Default batch output quantity must be greater than or equal to 0."),

    body("sale_pack_size")
        .optional({ nullable: true })
        .isFloat({ min: 1 })
        .withMessage("Sale pack size must be greater than or equal to 1."),

    body("quality_check_required")
        .optional()
        .isBoolean()
        .withMessage("Quality check required must be true or false."),
];

module.exports = {

    createFinishedProductValidation,

    updateFinishedProductValidation,

};