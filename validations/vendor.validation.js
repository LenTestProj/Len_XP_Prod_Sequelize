const { body } = require("express-validator");

const {
    Vendor,
    Items,
    Units,
    VendorItem,
    VendorItemPriceHistory,
    ItemUomConversion,
} = require("../models");


/*
|--------------------------------------------------------------------------
| Create Vendor
|--------------------------------------------------------------------------
*/

const createVendorValidation = [

    body("organisation_id")
        .custom((value) => {

            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                throw new Error(
                    "Organisation is required."
                );
            }

            if (
                !Number.isInteger(Number(value)) ||
                Number(value) < 1
            ) {
                throw new Error(
                    "Organisation must be a valid ID."
                );
            }

            return true;

        }),

    body("vendor_name")
        .exists({ checkFalsy: true })
        .withMessage(
            "Vendor name is required."
        )
        .bail()
        .isString()
        .withMessage(
            "Vendor name must be a string."
        )
        .bail()
        .trim()
        .notEmpty()
        .withMessage(
            "Vendor name is required."
        )
        .bail()
        .isLength({
            min: 2,
            max: 200,
        })
        .withMessage(
            "Vendor name must be between 2 and 200 characters."
        ),

    body("tax_registration_no")
        .optional({
            nullable: true,
        })
        .isString()
        .withMessage(
            "Tax registration number must be a string."
        )
        .isLength({
            max: 100,
        })
        .withMessage(
            "Tax registration number cannot exceed 100 characters."
        ),

    body("payment_terms_days")
        .optional({
            nullable: true,
        })
        .isInt({
            min: 0,
        })
        .withMessage(
            "Payment terms must be a valid number of days."
        ),

    body("is_active")
        .optional()
        .isBoolean()
        .withMessage(
            "Status must be a boolean."
        ),

];


/*
|--------------------------------------------------------------------------
| Update Vendor
|--------------------------------------------------------------------------
*/

const updateVendorValidation = [

    body("organisation_id")
        .custom((value) => {

            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                throw new Error(
                    "Organisation is required."
                );
            }

            if (
                !Number.isInteger(Number(value)) ||
                Number(value) < 1
            ) {
                throw new Error(
                    "Organisation must be a valid ID."
                );
            }

            return true;

        }),

    body("vendor_name")
        .exists({ checkFalsy: true })
        .withMessage(
            "Vendor name is required."
        )
        .bail()
        .isString()
        .withMessage(
            "Vendor name must be a string."
        )
        .bail()
        .trim()
        .notEmpty()
        .withMessage(
            "Vendor name is required."
        ),

    body("tax_registration_no")
        .optional({
            nullable: true,
        })
        .isString()
        .withMessage(
            "Tax registration number must be a string."
        ),

    body("payment_terms_days")
        .optional({
            nullable: true,
        })
        .isInt({
            min: 0,
        })
        .withMessage(
            "Payment terms must be a valid number of days."
        ),

    body("is_active")
        .optional()
        .isBoolean()
        .withMessage(
            "Status must be a boolean."
        ),

];


/*
|--------------------------------------------------------------------------
| Vendor Item
|--------------------------------------------------------------------------
*/

const createVendorItemValidation = [

    body("item_id")
        .custom(async (value) => {

            if (
                !Number.isInteger(Number(value)) ||
                Number(value) < 1
            ) {
                throw new Error(
                    "Item must be a valid ID."
                );
            }

            const item =
                await Items.findByPk(value);

            if (!item) {
                throw new Error(
                    "Item not found."
                );
            }

            if (!item.is_purchase_item) {
                throw new Error(
                    "Selected item is not configured as a purchase item."
                );
            }

            return true;

        }),

    body("purchase_uom_id")
        .custom(async (value, { req }) => {

            if (
                !Number.isInteger(Number(value)) ||
                Number(value) < 1
            ) {
                throw new Error(
                    "Purchase UOM must be a valid ID."
                );
            }

            const item =
                await Items.findByPk(
                    req.body.item_id
                );

            if (!item) {
                throw new Error(
                    "Item not found."
                );
            }

            const uom =
                await Units.findByPk(value);

            if (!uom) {
                throw new Error(
                    "Purchase UOM not found."
                );
            }

            /*
            |--------------------------------------------------------------------------
            | ItemUomConversion Usage
            |--------------------------------------------------------------------------
            |
            | If purchase UOM is different from item's base UOM,
            | conversion must exist.
            |
            */

            if (
                Number(value) !==
                Number(item.base_uom_id)
            ) {

                const conversion =
                    await ItemUomConversion.findOne({

                        where: {

                            item_id:
                                item.id,

                            from_uom_id:
                                value,

                            to_uom_id:
                                item.base_uom_id,

                            is_purchase_conversion:
                                true,

                        },

                    });

                if (!conversion) {

                    throw new Error(
                        "Purchase UOM conversion to base UOM is not configured for this item."
                    );

                }

            }

            return true;

        }),

    body("vendor_item_code")
        .optional({
            nullable: true,
        })
        .isString()
        .withMessage(
            "Vendor item code must be a string."
        )
        .isLength({
            max: 100,
        }),

    body("vendor_item_name")
        .optional({
            nullable: true,
        })
        .isString()
        .withMessage(
            "Vendor item name must be a string."
        )
        .isLength({
            max: 200,
        }),

    body("minimum_order_qty")
        .optional({
            nullable: true,
        })
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Minimum order quantity must be a valid number."
        ),

    body("standard_lead_time_days")
        .optional({
            nullable: true,
        })
        .isInt({
            min: 0,
        })
        .withMessage(
            "Lead time must be a valid number of days."
        ),

    body("preferred_vendor")
        .optional()
        .isBoolean()
        .withMessage(
            "Preferred vendor must be a boolean."
        ),

    body("is_active")
        .optional()
        .isBoolean()
        .withMessage(
            "Status must be a boolean."
        ),

];


/*
|--------------------------------------------------------------------------
| Vendor Item Price
|--------------------------------------------------------------------------
*/

const createVendorItemPriceValidation = [

    body("effective_from")
        .exists({ checkFalsy: true })
        .withMessage(
            "Effective from date is required."
        )
        .isISO8601()
        .withMessage(
            "Effective from must be a valid date."
        ),

    body("effective_to")
        .optional({
            nullable: true,
        })
        .isISO8601()
        .withMessage(
            "Effective to must be a valid date."
        ),

    body("currency_code")
        .optional()
        .isLength({
            min: 3,
            max: 3,
        })
        .withMessage(
            "Currency code must contain 3 characters."
        ),

    body("price_uom_id")
        .custom(async (value, { req }) => {

            if (
                !Number.isInteger(Number(value)) ||
                Number(value) < 1
            ) {
                throw new Error(
                    "Price UOM must be a valid ID."
                );
            }

            const uom =
                await Units.findByPk(value);

            if (!uom) {
                throw new Error(
                    "Price UOM not found."
                );
            }

            const vendorItem =
                await VendorItem.findByPk(
                    req.params.vendorItemId
                );

            if (!vendorItem) {
                throw new Error(
                    "Vendor item not found."
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Price UOM can be vendor purchase UOM or another configured UOM.
            |--------------------------------------------------------------------------
            */

            if (
                Number(value) !==
                Number(vendorItem.purchase_uom_id)
            ) {

                const item =
                    await Items.findByPk(
                        vendorItem.item_id
                    );

                const conversion =
                    await ItemUomConversion.findOne({

                        where: {

                            item_id:
                                vendorItem.item_id,

                            from_uom_id:
                                value,

                            to_uom_id:
                                item.base_uom_id,

                            is_purchase_conversion:
                                true,

                        },

                    });

                if (!conversion) {

                    throw new Error(
                        "Price UOM conversion is not configured for this item."
                    );

                }

            }

            return true;

        }),

    body("minimum_qty")
        .optional()
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Minimum quantity must be a valid number."
        ),

    body("basic_unit_price")
        .exists({ checkFalsy: true })
        .withMessage(
            "Basic unit price is required."
        )
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Basic unit price must be a valid number."
        ),

    body("discount_percent")
        .optional()
        .isFloat({
            min: 0,
            max: 100,
        })
        .withMessage(
            "Discount percent must be between 0 and 100."
        ),

    body("freight_per_unit")
        .optional()
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Freight per unit must be a valid number."
        ),

    body("other_charge_per_unit")
        .optional()
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Other charge per unit must be a valid number."
        ),

    body("source_type")
        .optional()
        .isIn([
            "QUOTATION",
            "CONTRACT",
            "NEGOTIATION",
            "MANUAL",
        ])
        .withMessage(
            "Invalid source type."
        ),

    body("reference_no")
        .optional({
            nullable: true,
        })
        .isString()
        .isLength({
            max: 100,
        }),

    body("remarks")
        .optional({
            nullable: true,
        })
        .isString()
        .isLength({
            max: 500,
        }),

];


module.exports = {

    createVendorValidation,
    updateVendorValidation,
    createVendorItemValidation,
    createVendorItemPriceValidation,

};