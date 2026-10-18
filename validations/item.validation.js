const { body } = require("express-validator");
const { Units,Items,Taxes } = require("../models");

/**
 * Create Item Validation
 */
const createItemValidation = [

    body("organisation_id")
    .custom((value) => {
        if (value === null || value === undefined || value === "") {
            throw new Error("Organisation is required.");
        }

        if (!Number.isInteger(Number(value)) || Number(value) < 1) {
            throw new Error("Organisation must be a valid ID.");
        }

        return true;
    }),

    body("item_name")
        .trim()
        .notEmpty()
        .withMessage("Item name is required.")
        .isLength({ min:3, max: 200 })
        .withMessage("Item Name must be between 3 and 200 characters."),

    body("item_type")
        .notEmpty()
        .isIn([
            "RAW_MATERIAL",
            "PACKAGING_MATERIAL",
            "FINISHED_PRODUCT",
        ])
        .withMessage("Invalid item type."),

    body("base_uom_id")
        .custom(async (value) => {

            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                throw new Error("Base UOM is required.");
            }

            if (Array.isArray(value)) {
                throw new Error("Base UOM must be a valid ID.");
            }

            if (
                typeof value !== "string" &&
                typeof value !== "number"
            ) {
                throw new Error("Base UOM must be a valid ID.");
            }

            const id = String(value).trim();

            if (!/^\d+$/.test(id) || Number(id) < 1) {
                throw new Error("Base UOM must be a valid ID.");
            }

            const unit = await Units.findOne({
                where: {
                    id: Number(id),
                },
            });

            if (!unit) {
                throw new Error("Selected Base UOM not found.");
            }

            if (unit.is_deleted) {
                throw new Error("Selected Base UOM is deleted.");
            }

            if (unit.status !== "active") {
                throw new Error("Selected Base UOM is inactive.");
            }

            return true;
        }),
    body("tax_id")
        .custom(async (value) => {

            // Required check
            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                throw new Error("Tax is required.");
            }

            // Reject arrays
            if (Array.isArray(value)) {
                throw new Error("Tax must be a valid ID.");
            }

            // Only string or number allowed
            if (
                typeof value !== "string" &&
                typeof value !== "number"
            ) {
                throw new Error("Tax must be a valid ID.");
            }

            // Convert to string and trim
            const id = String(value).trim();

            // Validate ID format
            if (!/^\d+$/.test(id) || Number(id) < 1) {
                throw new Error("Tax must be a valid ID.");
            }

            // Check tax exists
            const tax = await Taxes.findOne({
                where: {
                    id: Number(id),
                },
            });

            if (!tax) {
                throw new Error("Selected Tax not found.");
            }

            // Check deleted
            if (tax.is_deleted) {
                throw new Error("Selected Tax is deleted.");
            }

            // Check active
            if (tax.status !== "active") {
                throw new Error("Selected Tax is inactive.");
            }

            return true;
        }),
    body("batch_tracking_required")
        .optional()
        .isBoolean()
        .withMessage("Batch tracking required must be a boolean."),

    body("expiry_tracking_required")
        .optional()
        .isBoolean()
        .withMessage("Expiry tracking required must be a boolean."),

    body("shelf_life_days")
        .optional({ nullable: true })
        .isFloat({ min: 0.1 })
        .withMessage("Shelf life days must be a valid integer greater than or equal to 0.1."),

    body("inventory_valuation_method")
        .optional()
        .isIn([
            "FIFO",
            "FEFO",
            "WEIGHTED_AVERAGE",
            "SPECIFIC_LOT",
        ])
        .withMessage(
        "Inventory valuation method must be FIFO, FEFO, WEIGHTED_AVERAGE, or SPECIFIC_LOT."
        ),

    body("standard_cost")
        .optional({ nullable: true })
        .isFloat({ min: 1 })
        .withMessage("Standard cost must be a valid number greater than or equal to 1."),

    body("last_purchase_cost")
        .optional({ nullable: true })
        .isFloat({ min: 1 })
        .withMessage("Last purchase cost must be a valid number greater than or equal to 1."),

    body("minimum_stock_qty")
        .optional()
        .isFloat({ min: 1 })
        .withMessage("Minimum stock quantity must be a valid number greater than or equal to 1."),

    body("reorder_qty")
        .optional()
        .isFloat({ min: 1 })
        .withMessage("Reorder quantity must be a valid number greater than or equal to 1."),

    body("is_purchase_item")
        .notEmpty()
        .withMessage("Is purchase item is required.")
        .isBoolean()
        .withMessage("Purchase Item must be a boolean."),

    body("is_manufactured_item")
        .notEmpty()
        .withMessage("Is manufactured item is required.")
        .isBoolean()
        .withMessage("Manufactured Item must be a boolean."),

    body("is_sale_item")
        .notEmpty()
        .withMessage("Is sale item is required.")
        .isBoolean()
        .withMessage("Sale Item must be a boolean."),

    /*
    |--------------------------------------------------------------------------
    | RAW MATERIAL VALIDATION
    |--------------------------------------------------------------------------
    */

    body("rawMaterialDetails")
    .if(body("item_type").equals("RAW_MATERIAL"))
    .notEmpty()
    .withMessage("rawMaterialDetails is required."),

    // body("rawMaterialDetails.item_id")
    //     .if(body("item_type").equals("RAW_MATERIAL"))
    //     .notEmpty()
    //     .withMessage("Raw material item is required.")
    //     .bail()
    //     .isInt({ min: 1 })
    //     .withMessage("Raw material item must be a valid ID.")
    //     .bail()
    //     .custom(async (value) => {

    //         const item = await Items.findOne({
    //             where: {
    //                 id: value,
    //             },
    //         });

    //         if (!item) {
    //             throw new Error("Selected Raw Material Item not found.");
    //         }

    //         if (item.is_deleted) {
    //             throw new Error("Selected Raw Material Item is deleted.");
    //         }

    //         if (item.status !== "active") {
    //             throw new Error("Selected Raw Material Item is inactive.");
    //         }

    //         return true;
    //     }),

    body("rawMaterialDetails.material_category")
        .if(body("item_type").equals("RAW_MATERIAL"))
        .optional(),
        // .isString()
        // .withMessage("Material category must be a string."),

    body("rawMaterialDetails.ingredient_name")
        .if(body("item_type").equals("RAW_MATERIAL"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isString()
        .withMessage("Ingredient name must be a string.")
        .isLength({ min: 3, max: 150 })
        .withMessage(
            "Ingredient name must be between 3 and 150 characters."
        ),

    body("rawMaterialDetails.allergen_information")
        .if(body("item_type").equals("RAW_MATERIAL"))
        .customSanitizer((value) => {
            if (value === null || value === undefined || value.trim() === "") {
                return null;
            }
            return value;
        })
        .optional({ nullable: true })
        .isString()
        .withMessage("Allergen information must be a string.")
        .isLength({ min: 3, max: 500 })
        .withMessage(
            "Allergen information must be between 3 and 500 characters."
        ),

    body("rawMaterialDetails.requires_quality_check")
        .if(body("item_type").equals("RAW_MATERIAL"))
        .optional({ nullable: true })
        .isBoolean()
        .withMessage("Requires quality check must be a boolean."),

    body("rawMaterialDetails.storage_temperature_min")
        .if(body("item_type").equals("RAW_MATERIAL"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isFloat()
        .withMessage("Minimum storage temperature must be a valid number."),

    body("rawMaterialDetails.storage_temperature_max")
        .if(body("item_type").equals("RAW_MATERIAL"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isFloat()
        .withMessage("Maximum storage temperature must be a valid number."),

    body("rawMaterialDetails.density_kg_per_litre")
        .if(body("item_type").equals("RAW_MATERIAL"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isFloat({ min: 0.01 })
        .withMessage("Density must be a valid number greater than 0."),
    /*
    |--------------------------------------------------------------------------
    | PACKAGING MATERIAL VALIDATION
    |--------------------------------------------------------------------------
    */

    body("packagingMaterialDetails")
    .if(body("item_type").equals("PACKAGING_MATERIAL"))
    .notEmpty()
    .withMessage("packagingMaterialDetails is required."),

    // body("packagingMaterialDetails.item_id")
    //     .if(body("item_type").equals("PACKAGING_MATERIAL"))
    //     .notEmpty()
    //     .withMessage("Packaging material item is required.")
    //     .bail()
    //     .isInt({ min: 1 })
    //     .withMessage("Packaging material item must be a valid ID.")
    //     .bail()
    //     .custom(async (value) => {

    //         const item = await Items.findOne({
    //             where: {
    //                 id: value,
    //             },
    //         });

    //         if (!item) {
    //             throw new Error("Selected Packaging Material Item not found.");
    //         }

    //         if (item.is_deleted) {
    //             throw new Error("Selected Packaging Material Item is deleted.");
    //         }

    //         if (item.status !== "active") {
    //             throw new Error("Selected Packaging Material Item is inactive.");
    //         }

    //         return true;
    //     }),

    body("packagingMaterialDetails.packaging_level")
        .if(body("item_type").equals("PACKAGING_MATERIAL"))
        .notEmpty()
        .withMessage("Packaging level is required.")
        .bail()
        .isIn([
            "PRIMARY",
            "SECONDARY",
            "TERTIARY",
        ])
        .withMessage("Packaging level must be PRIMARY, SECONDARY, or TERTIARY."),

    body("packagingMaterialDetails.packaging_type")
        .if(body("item_type").equals("PACKAGING_MATERIAL"))
        .notEmpty()
        .withMessage("Packaging type is required.")
        .bail()
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

    body("packagingMaterialDetails.capacity_value")
        .if(body("item_type").equals("PACKAGING_MATERIAL"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isFloat({ min: 0.01 })
        .withMessage("Capacity value must be greater than 0."),

    body("packagingMaterialDetails.capacity_uom_id")
        .if(body("item_type").equals("PACKAGING_MATERIAL"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage(
            "Capacity UOM ID must be a valid id ."
        )
        .bail()
        .custom(async (value) => {

            const unit = await Units.findOne({
                where: {
                    id: value,
                },
            });

            if (!unit) {
                throw new Error("Selected Capacity UOM not found.");
            }

            if (unit.is_deleted) {
                throw new Error("Selected Capacity UOM is deleted.");
            }

            if (unit.status !== "active") {
                throw new Error("Selected Capacity UOM is inactive.");
            }

            return true;
        }),

    body("packagingMaterialDetails.units_per_pack")
        .if(body("item_type").equals("PACKAGING_MATERIAL"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isFloat({ min: 0.01 })
        .withMessage("Units per pack must be greater than 0."),

    body("packagingMaterialDetails.reusable")
        .if(body("item_type").equals("PACKAGING_MATERIAL"))
        .optional()
        .notEmpty()
        .withMessage("Packaging material reusable is required.")
        .isBoolean()
        .withMessage("Packaging material reusable must be a boolean."),
    /*
    |--------------------------------------------------------------------------
    | FINISHED PRODUCT VALIDATION
    |--------------------------------------------------------------------------
    */

    body("finishedProductDetails")
        .if(body("item_type").equals("FINISHED_PRODUCT"))
        .notEmpty()
        .withMessage("finishedProductDetails is required."),

    body("finishedProductDetails.product_category")
        .if(body("item_type").equals("FINISHED_PRODUCT"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isString()
        .withMessage("Product category must be a string."),

    body("finishedProductDetails.net_content_value")
        .if(body("item_type").equals("FINISHED_PRODUCT"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isFloat({ min: 0.01 })
        .withMessage("Net content value must be greater than 0."),

    body("finishedProductDetails.net_content_uom_id")
        .if(body("item_type").equals("FINISHED_PRODUCT"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage(
            "Net content UOM ID must be a valid id ."
        )
        .bail()
        .custom(async (value) => {

            const unit = await Units.findOne({
                where: {
                    id: value,
                },
            });

            if (!unit) {
                throw new Error("Selected Net Content UOM not found.");
            }

            if (unit.is_deleted) {
                throw new Error("Selected Net Content UOM is deleted.");
            }

            if (unit.status !== "active") {
                throw new Error("Selected Net Content UOM is inactive.");
            }

            return true;
        }),

    body("finishedProductDetails.default_batch_output_qty")
        .if(body("item_type").equals("FINISHED_PRODUCT"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isFloat({ min: 0.01 })
        .withMessage(
            "Default batch output quantity must be greater than 0."
        ),
    body("finishedProductDetails.sale_pack_size")
        .if(body("item_type").equals("FINISHED_PRODUCT"))
        .notEmpty()
        .withMessage("Sale pack size is required .")
        .isFloat({ min: 0.01 })
        .withMessage("Sale pack size must be a valid number."),

   body("finishedProductDetails.quality_check_required")
        .if(body("item_type").equals("FINISHED_PRODUCT"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return undefined;
            }

            return value;
        })
        .optional()
        .isBoolean()
        .withMessage(
            "Finished product quality check required must be a boolean."
        ),
];

/**
 * Update Validation
 */
const updateItemValidation = [

    body("organisation_id")
    .custom((value) => {
        if (value === null || value === undefined || value === "") {
            throw new Error("Organisation is required.");
        }

        if (!Number.isInteger(Number(value)) || Number(value) < 1) {
            throw new Error("Organisation must be a valid ID.");
        }

        return true;
    }),

    body("item_name")
        .trim()
        .notEmpty()
        .withMessage("Item name is required.")
        .isLength({ min:3, max: 200 })
        .withMessage("Item name must be between 3 and 200 characters."),

    body("item_type")
        .notEmpty()
        .isIn([
            "RAW_MATERIAL",
            "PACKAGING_MATERIAL",
            "FINISHED_PRODUCT",
        ])
        .withMessage("Invalid item type."),

    body("base_uom_id")
        .custom(async (value) => {

            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                throw new Error("Base UOM is required.");
            }

            if (Array.isArray(value)) {
                throw new Error("Base UOM must be a valid ID.");
            }

            if (
                typeof value !== "string" &&
                typeof value !== "number"
            ) {
                throw new Error("Base UOM must be a valid ID.");
            }

            const id = String(value).trim();

            if (!/^\d+$/.test(id) || Number(id) < 1) {
                throw new Error("Base UOM must be a valid ID.");
            }

            const unit = await Units.findOne({
                where: {
                    id: Number(id),
                },
            });

            if (!unit) {
                throw new Error("Selected Base UOM not found.");
            }

            if (unit.is_deleted) {
                throw new Error("Selected Base UOM is deleted.");
            }

            if (unit.status !== "active") {
                throw new Error("Selected Base UOM is inactive.");
            }

            return true;
        }),
    body("tax_id")
        .custom(async (value) => {

            // Required check
            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                throw new Error("Tax is required.");
            }

            // Reject arrays
            if (Array.isArray(value)) {
                throw new Error("Tax must be a valid ID.");
            }

            // Only string or number allowed
            if (
                typeof value !== "string" &&
                typeof value !== "number"
            ) {
                throw new Error("Tax must be a valid ID.");
            }

            // Convert to string and trim
            const id = String(value).trim();

            // Validate ID format
            if (!/^\d+$/.test(id) || Number(id) < 1) {
                throw new Error("Tax must be a valid ID.");
            }

            // Check tax exists
            const tax = await Taxes.findOne({
                where: {
                    id: Number(id),
                },
            });

            if (!tax) {
                throw new Error("Selected Tax not found.");
            }

            // Check deleted
            if (tax.is_deleted) {
                throw new Error("Selected Tax is deleted.");
            }

            // Check active
            if (tax.status !== "active") {
                throw new Error("Selected Tax is inactive.");
            }

            return true;
        }),
    body("batch_tracking_required")
        .optional()
        .isBoolean()
        .withMessage("Batch tracking required must be a boolean."),

    body("expiry_tracking_required")
        .optional()
        .isBoolean()
        .withMessage("Expiry tracking required must be a boolean."),

    body("shelf_life_days")
        .optional({ nullable: true })
        .isFloat({ min: 0.1 })
        .withMessage("Shelf life days must be a valid integer greater than or equal to 0.1."),

    body("inventory_valuation_method")
        .optional()
        .isIn([
            "FIFO",
            "FEFO",
            "WEIGHTED_AVERAGE",
            "SPECIFIC_LOT",
        ])
        .withMessage("Inventory valuation method must be FIFO, FEFO, WEIGHTED_AVERAGE, or SPECIFIC_LOT."),

    body("standard_cost")
        .optional({ nullable: true })
        .isFloat({ min: 1 })
        .withMessage("Standard cost must be a valid number greater than or equal to 1."),

    body("last_purchase_cost")
        .optional({ nullable: true })
        .isFloat({ min: 1 })
        .withMessage("Last purchase cost must be a valid number greater than or equal to 1."),

    body("minimum_stock_qty")
        .optional()
        .isFloat({ min: 1 })
        .withMessage("Minimum stock quantity must be a valid number greater than or equal to 1."),

    body("reorder_qty")
        .optional()
        .isFloat({ min: 1 })
        .withMessage("Reorder quantity must be a valid number greater than or equal to 1."),

    body("is_purchase_item")
        .optional()
        .isBoolean()
        .withMessage("Is purchase item must be a boolean."),

    body("is_manufactured_item")
        .optional()
        .isBoolean()
        .withMessage("Is manufactured item must be a boolean."),

    body("is_sale_item")
        .optional()
        .isBoolean()
        .withMessage("Is sale item must be a boolean."),

    /*
    |--------------------------------------------------------------------------
    | RAW MATERIAL VALIDATION
    |--------------------------------------------------------------------------
    */

    body("rawMaterialDetails")
        .if(body("item_type").equals("RAW_MATERIAL"))
        .notEmpty()
        .withMessage("rawMaterialDetails is required."),


    body("rawMaterialDetails.material_category")
        .if(body("item_type").equals("RAW_MATERIAL"))
        .optional(),
        // .isString()
        // .withMessage("Material category must be a string."),

    body("rawMaterialDetails.ingredient_name")
        .if(body("item_type").equals("RAW_MATERIAL"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isString()
        .withMessage("Ingredient name must be a string.")
        .isLength({ min: 3, max: 150 })
        .withMessage(
            "Ingredient name must be between 3 and 150 characters."
        ),

    body("rawMaterialDetails.allergen_information")
        .if(body("item_type").equals("RAW_MATERIAL"))
        .customSanitizer((value) => {
            if (value === null || value === undefined || value.trim() === "") {
                return null;
            }
            return value;
        })
        .optional({ nullable: true })
        .isString()
        .withMessage("Allergen information must be a string.")
        .isLength({ min: 3, max: 500 })
        .withMessage(
            "Allergen information must be between 3 and 500 characters."
        ),

    body("rawMaterialDetails.requires_quality_check")
        .if(body("item_type").equals("RAW_MATERIAL"))
        .optional({ nullable: true })
        .isBoolean()
        .withMessage("Requires quality check must be a boolean."),

    body("rawMaterialDetails.storage_temperature_min")
        .if(body("item_type").equals("RAW_MATERIAL"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isFloat()
        .withMessage("Minimum storage temperature must be a valid number."),

    body("rawMaterialDetails.storage_temperature_max")
        .if(body("item_type").equals("RAW_MATERIAL"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isFloat()
        .withMessage("Maximum storage temperature must be a valid number."),

    body("rawMaterialDetails.density_kg_per_litre")
        .if(body("item_type").equals("RAW_MATERIAL"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isFloat({ min: 0.01 })
        .withMessage("Density must be a valid number greater than 0."),
    /*
    |--------------------------------------------------------------------------
    | PACKAGING MATERIAL VALIDATION
    |--------------------------------------------------------------------------
    */

    body("packagingMaterialDetails")
        .if(body("item_type").equals("PACKAGING_MATERIAL"))
        .notEmpty()
        .withMessage("packagingMaterialDetails is required."),

    body("packagingMaterialDetails.packaging_level")
        .if(body("item_type").equals("PACKAGING_MATERIAL"))
        .notEmpty()
        .withMessage("Packaging level is required.")
        .bail()
        .isIn([
            "PRIMARY",
            "SECONDARY",
            "TERTIARY",
        ])
        .withMessage("Packaging level must be PRIMARY, SECONDARY, or TERTIARY."),

    body("packagingMaterialDetails.packaging_type")
        .if(body("item_type").equals("PACKAGING_MATERIAL"))
        .notEmpty()
        .withMessage("Packaging type is required.")
        .bail()
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

    body("packagingMaterialDetails.capacity_value")
        .if(body("item_type").equals("PACKAGING_MATERIAL"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isFloat({ min: 0.01 })
        .withMessage("Capacity value must be greater than 0."),

    body("packagingMaterialDetails.capacity_uom_id")
        .if(body("item_type").equals("PACKAGING_MATERIAL"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage(
            "Capacity UOM ID must be a valid id ."
        )
        .bail()
        .custom(async (value) => {

            const unit = await Units.findOne({
                where: {
                    id: value,
                },
            });

            if (!unit) {
                throw new Error("Selected Capacity UOM not found.");
            }

            if (unit.is_deleted) {
                throw new Error("Selected Capacity UOM is deleted.");
            }

            if (unit.status !== "active") {
                throw new Error("Selected Capacity UOM is inactive.");
            }

            return true;
        }),

    body("packagingMaterialDetails.units_per_pack")
        .if(body("item_type").equals("PACKAGING_MATERIAL"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isFloat({ min: 0.01 })
        .withMessage("Units per pack must be greater than 0."),

    body("packagingMaterialDetails.reusable")
        .if(body("item_type").equals("PACKAGING_MATERIAL"))
        .optional()
        .notEmpty()
        .withMessage("Packaging material reusable is required.")
        .isBoolean()
        .withMessage("Packaging material reusable must be a boolean."),

    /*
    |--------------------------------------------------------------------------
    | FINISHED PRODUCT VALIDATION
    |--------------------------------------------------------------------------
    */

    body("finishedProductDetails")
        .if(body("item_type").equals("FINISHED_PRODUCT"))
        .notEmpty()
        .withMessage("finishedProductDetails is required."),

    body("finishedProductDetails.product_category")
        .if(body("item_type").equals("FINISHED_PRODUCT"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isString()
        .withMessage("Product category must be a string."),

    body("finishedProductDetails.net_content_value")
        .if(body("item_type").equals("FINISHED_PRODUCT"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isFloat({ min: 0.01 })
        .withMessage("Net content value must be greater than 0."),

    body("finishedProductDetails.net_content_uom_id")
        .if(body("item_type").equals("FINISHED_PRODUCT"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage(
            "Net content UOM ID must be a valid id ."
        )
        .bail()
        .custom(async (value) => {

            const unit = await Units.findOne({
                where: {
                    id: value,
                },
            });

            if (!unit) {
                throw new Error("Selected Net Content UOM not found.");
            }

            if (unit.is_deleted) {
                throw new Error("Selected Net Content UOM is deleted.");
            }

            if (unit.status !== "active") {
                throw new Error("Selected Net Content UOM is inactive.");
            }

            return true;
        }),

    body("finishedProductDetails.default_batch_output_qty")
        .if(body("item_type").equals("FINISHED_PRODUCT"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return null;
            }

            return value;
        })
        .optional({ nullable: true })
        .isFloat({ min: 0.01 })
        .withMessage(
            "Default batch output quantity must be greater than 0."
        ),

    body("finishedProductDetails.sale_pack_size")
        .if(body("item_type").equals("FINISHED_PRODUCT"))
        .notEmpty()
        .withMessage("Sale pack size is required .")
        .isFloat({ min: 0.01 })
        .withMessage("Sale pack size must be a valid number."),

    body("finishedProductDetails.quality_check_required")
        .if(body("item_type").equals("FINISHED_PRODUCT"))
        .customSanitizer((value) => {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return undefined;
            }

            return value;
        })
        .optional()
        .isBoolean()
        .withMessage(
            "Finished product quality check required must be a boolean."
        ),
];
// const updateItemValidation = createItemValidation
//     .map(rule => rule.optional({ nullable: true }));

module.exports = {
    createItemValidation,
    updateItemValidation,
};