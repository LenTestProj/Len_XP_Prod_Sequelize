const { body } = require("express-validator");


const createPurchaseReceiptValidation = [

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


    body("vendor_id")
        .custom((value) => {

            if (
                !Number.isInteger(Number(value)) ||
                Number(value) < 1
            ) {
                throw new Error(
                    "Vendor must be a valid ID."
                );
            }

            return true;

        }),


    body("warehouse_id")
        .custom((value) => {

            if (
                !Number.isInteger(Number(value)) ||
                Number(value) < 1
            ) {
                throw new Error(
                    "Warehouse must be a valid ID."
                );
            }

            return true;

        }),


    body("receipt_date")
        .notEmpty()
        .withMessage(
            "Receipt date is required."
        )
        .isDate()
        .withMessage(
            "Receipt date must be a valid date."
        ),


    body("supplier_invoice_no")
        .optional({
            nullable: true,
        })
        .isString()
        .withMessage(
            "Supplier invoice number must be a string."
        )
        .isLength({
            max: 100,
        }),


    body("supplier_invoice_date")
        .optional({
            nullable: true,
        })
        .isDate()
        .withMessage(
            "Supplier invoice date must be a valid date."
        ),


    body("currency_code")
        .optional()
        .isLength({
            min: 3,
            max: 3,
        })
        .withMessage(
            "Currency code must be 3 characters."
        ),


    body("lines")
        .isArray({
            min: 1,
        })
        .withMessage(
            "At least one purchase line is required."
        ),


    body("lines.*.item_id")
        .custom((value) => {

            if (
                !Number.isInteger(Number(value)) ||
                Number(value) < 1
            ) {
                throw new Error(
                    "Item must be a valid ID."
                );
            }

            return true;

        }),


    body("lines.*.purchase_uom_id")
        .custom((value) => {

            if (
                !Number.isInteger(Number(value)) ||
                Number(value) < 1
            ) {
                throw new Error(
                    "Purchase UOM must be a valid ID."
                );
            }

            return true;

        }),


    body("lines.*.received_qty")
        .custom((value) => {

            if (
                isNaN(Number(value)) ||
                Number(value) <= 0
            ) {
                throw new Error(
                    "Received quantity must be greater than 0."
                );
            }

            return true;

        }),


    body("lines.*.accepted_qty")
        .optional()
        .custom((value) => {

            if (
                isNaN(Number(value)) ||
                Number(value) < 0
            ) {
                throw new Error(
                    "Accepted quantity cannot be negative."
                );
            }

            return true;

        }),


    body("lines.*.rejected_qty")
        .optional()
        .custom((value) => {

            if (
                isNaN(Number(value)) ||
                Number(value) < 0
            ) {
                throw new Error(
                    "Rejected quantity cannot be negative."
                );
            }

            return true;

        }),


    body("lines.*.basic_unit_price")
        .custom((value) => {

            if (
                isNaN(Number(value)) ||
                Number(value) < 0
            ) {
                throw new Error(
                    "Basic unit price cannot be negative."
                );
            }

            return true;

        }),


    body("lines.*.discount_amount")
        .optional()
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Discount amount cannot be negative."
        ),


    body("lines.*.tax_amount")
        .optional()
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Tax amount cannot be negative."
        ),


    body("lines.*.freight_amount")
        .optional()
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Freight amount cannot be negative."
        ),


    body("lines.*.other_charge_amount")
        .optional()
        .isFloat({
            min: 0,
        })
        .withMessage(
            "Other charge amount cannot be negative."
        ),

];


module.exports = {
    createPurchaseReceiptValidation,
};