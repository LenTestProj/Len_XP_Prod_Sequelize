const { body, param } = require("express-validator");


/**
 * Create Vendor Item + Price History
 */
const createVendorItemValidation = [

    body("vendor_id")
        .notEmpty()
        .withMessage("Vendor is required.")
        .isInt({ min: 1 })
        .withMessage("Vendor must be a valid ID."),

    body("item_id")
        .notEmpty()
        .withMessage("Item is required.")
        .isInt({ min: 1 })
        .withMessage("Item must be a valid ID."),

    body("vendor_item_code")
        .optional({ nullable: true })
        .isLength({ max: 100 })
        .withMessage(
            "Vendor item code cannot exceed 100 characters."
        ),

    body("vendor_item_name")
        .optional({ nullable: true })
        .isLength({ max: 200 })
        .withMessage(
            "Vendor item name cannot exceed 200 characters."
        ),

    body("purchase_uom_id")
        .notEmpty()
        .withMessage("Purchase UOM is required.")
        .isInt({ min: 1 })
        .withMessage(
            "Purchase UOM must be a valid ID."
        ),

    body("minimum_order_qty")
        .optional({ nullable: true })
        .isDecimal()
        .withMessage(
            "Minimum order quantity must be a valid number."
        ),

    body("standard_lead_time_days")
        .optional({ nullable: true })
        .isInt({ min: 0 })
        .withMessage(
            "Standard lead time must be a valid number."
        ),

    body("preferred_vendor")
        .optional()
        .isBoolean()
        .withMessage(
            "preferred_vendor must be true or false."
        ),

    body("is_active")
        .optional()
        .isBoolean()
        .withMessage(
            "is_active must be true or false."
        ),

    body("prices")
        .optional()
        .isArray()
        .withMessage(
            "Prices must be an array."
        ),

    body("prices.*.effective_from")
        .if(body("prices").exists())
        .notEmpty()
        .withMessage(
            "Price effective_from is required."
        )
        .isISO8601()
        .withMessage(
            "Price effective_from must be a valid date."
        ),

    body("prices.*.effective_to")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage(
            "Price effective_to must be a valid date."
        ),

    body("prices.*.currency_code")
        .optional()
        .isLength({ min: 3, max: 3 })
        .withMessage(
            "Currency code must contain 3 characters."
        ),

    body("prices.*.price_uom_id")
        .if(body("prices").exists())
        .notEmpty()
        .withMessage(
            "Price UOM is required."
        )
        .isInt({ min: 1 })
        .withMessage(
            "Price UOM must be a valid ID."
        ),

    body("prices.*.minimum_qty")
        .optional()
        .isDecimal()
        .withMessage(
            "Minimum quantity must be a valid number."
        ),

    body("prices.*.basic_unit_price")
        .if(body("prices").exists())
        .notEmpty()
        .withMessage(
            "Basic unit price is required."
        )
        .isDecimal({ decimal_digits: "0,6" })
        .withMessage(
            "Basic unit price must be a valid number."
        ),

    body("prices.*.discount_percent")
        .optional()
        .isDecimal()
        .withMessage(
            "Discount percent must be a valid number."
        ),

    body("prices.*.freight_per_unit")
        .optional()
        .isDecimal()
        .withMessage(
            "Freight per unit must be a valid number."
        ),

    body("prices.*.other_charge_per_unit")
        .optional()
        .isDecimal()
        .withMessage(
            "Other charge per unit must be a valid number."
        ),

    body("prices.*.source_type")
        .optional()
        .isIn([
            "QUOTATION",
            "CONTRACT",
            "NEGOTIATION",
            "MANUAL",
        ])
        .withMessage(
            "Invalid price source type."
        ),
];


/**
 * Update Vendor Item + Price History
 */
const updateVendorItemValidation = [

    param("id")
        .isInt({ min: 1 })
        .withMessage(
            "Vendor item ID must be valid."
        ),

    body("vendor_item_code")
        .optional({ nullable: true })
        .isLength({ max: 100 })
        .withMessage(
            "Vendor item code cannot exceed 100 characters."
        ),

    body("vendor_item_name")
        .optional({ nullable: true })
        .isLength({ max: 200 })
        .withMessage(
            "Vendor item name cannot exceed 200 characters."
        ),

    body("purchase_uom_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage(
            "Purchase UOM must be a valid ID."
        ),

    body("minimum_order_qty")
        .optional({ nullable: true })
        .isDecimal()
        .withMessage(
            "Minimum order quantity must be a valid number."
        ),

    body("standard_lead_time_days")
        .optional({ nullable: true })
        .isInt({ min: 0 })
        .withMessage(
            "Standard lead time must be a valid number."
        ),

    body("preferred_vendor")
        .optional()
        .isBoolean()
        .withMessage(
            "preferred_vendor must be true or false."
        ),

    body("is_active")
        .optional()
        .isBoolean()
        .withMessage(
            "is_active must be true or false."
        ),

    body("prices")
        .optional()
        .isArray()
        .withMessage(
            "Prices must be an array."
        ),
];


module.exports = {
    createVendorItemValidation,
    updateVendorItemValidation,
};