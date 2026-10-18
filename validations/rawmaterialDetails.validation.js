const { body } = require("express-validator");

/**
 * Create Raw Material Validation
 */
const createRawMaterialValidation = [

    body("item_id")
        .notEmpty()
        .withMessage("Item is required.")
        .isInt({ min: 1 })
        .withMessage("Invalid item."),

    body("material_category")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Material category must not exceed 100 characters."),

    body("ingredient_name")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Ingredient name must not exceed 200 characters."),

    body("allergen_information")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Allergen information must not exceed 500 characters."),

    body("requires_quality_check")
        .optional()
        .isBoolean()
        .withMessage("Requires quality check must be true or false."),

    body("storage_temperature_min")
        .optional({ nullable: true })
        .isFloat()
        .withMessage("Storage minimum temperature must be numeric."),

    body("storage_temperature_max")
        .optional({ nullable: true })
        .isFloat()
        .withMessage("Storage maximum temperature must be numeric."),

    body("density_kg_per_litre")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage("Density must be greater than or equal to 0."),
];

/**
 * Update Raw Material Validation
 */
const updateRawMaterialValidation = [

    body("material_category")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Material category must not exceed 100 characters."),

    body("ingredient_name")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Ingredient name must not exceed 200 characters."),

    body("allergen_information")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Allergen information must not exceed 500 characters."),

    body("requires_quality_check")
        .optional()
        .isBoolean()
        .withMessage("Requires quality check must be true or false."),

    body("storage_temperature_min")
        .optional({ nullable: true })
        .isFloat()
        .withMessage("Storage minimum temperature must be numeric."),

    body("storage_temperature_max")
        .optional({ nullable: true })
        .isFloat()
        .withMessage("Storage maximum temperature must be numeric."),

    body("density_kg_per_litre")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage("Density must be greater than or equal to 0."),
];

module.exports = {

    createRawMaterialValidation,

    updateRawMaterialValidation,

};