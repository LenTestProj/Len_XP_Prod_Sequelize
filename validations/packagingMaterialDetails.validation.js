const { body } = require("express-validator");

/**
 * Create Packaging Material Validation
 */
const createPackagingMaterialValidation = [

    body("item_id")
        .notEmpty()
        .withMessage("Item is required.")
        .isInt({ min: 1 })
        .withMessage("Invalid item."),

    body("packaging_level")
        .notEmpty()
        .withMessage("Packaging level is required.")
        .isIn([
            "PRIMARY",
            "SECONDARY",
            "TERTIARY",
        ])
        .withMessage("Invalid packaging level."),

    body("packaging_type")
        .notEmpty()
        .withMessage("Packaging type is required.")
        .isIn([
            "BOTTLE",
            "CAP",
            "LABEL",
            "POUCH",
            "SACHET",
            "BOX",
            "CARTON",
            "TRAY",
            "SHRINK_WRAP",
            "PALLET",
            "OTHER",
        ])
        .withMessage("Invalid packaging type."),

    body("capacity_value")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage("Capacity value must be greater than or equal to 0."),

    body("capacity_uom_id")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("Invalid capacity unit."),

    body("units_per_pack")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage("Units per pack must be greater than or equal to 0."),

    body("reusable")
        .optional()
        .isBoolean()
        .withMessage("Reusable must be true or false."),
];

/**
 * Update Packaging Material Validation
 */
const updatePackagingMaterialValidation = [

    body("packaging_level")
        .optional()
        .isIn([
            "PRIMARY",
            "SECONDARY",
            "TERTIARY",
        ])
        .withMessage("Invalid packaging level."),

    body("packaging_type")
        .optional()
        .isIn([
            "BOTTLE",
            "CAP",
            "LABEL",
            "POUCH",
            "SACHET",
            "BOX",
            "CARTON",
            "TRAY",
            "SHRINK_WRAP",
            "PALLET",
            "OTHER",
        ])
        .withMessage("Invalid packaging type."),

    body("capacity_value")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage("Capacity value must be greater than or equal to 0."),

    body("capacity_uom_id")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("Invalid capacity unit."),

    body("units_per_pack")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage("Units per pack must be greater than or equal to 0."),

    body("reusable")
        .optional()
        .isBoolean()
        .withMessage("Reusable must be true or false."),
];

module.exports = {

    createPackagingMaterialValidation,

    updatePackagingMaterialValidation,

};