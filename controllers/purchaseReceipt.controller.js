const sequelize = require("../config/database");

const {
    PurchaseReceipts,
    PurchaseReceiptLines,
    Items,
    Units,
    Organisation,
    Vendors,
    Warehouses,
    ItemUomConversion,
    VendorItem,
    VendorItemPriceHistory,
} = require("../models");

const {
    createPurchaseReceipt,
    createPurchaseReceiptLine,
    findPurchaseReceiptById,
    findPurchaseReceiptByNo,
    updatePurchaseReceipt,
    getAllPurchaseReceipts,
} = require("../services/purchaseReceipt.service");

const {
    generatePurchaseReceiptNo,
} = require("../helpers/unique.code.helper");


class PurchaseReceiptController {


    /*
    |--------------------------------------------------------------------------
    | Create Purchase Receipt
    |--------------------------------------------------------------------------
    | POST /purchase-receipts
    |--------------------------------------------------------------------------
    */

    static async create(req, res) {

        const transaction =
            await sequelize.transaction();

        try {

            const {
                organisation_id,
                vendor_id,
                warehouse_id,
                receipt_date,
                supplier_invoice_no,
                supplier_invoice_date,
                currency_code,
                lines = [],
            } = req.body;


            /*
            |--------------------------------------------------------------------------
            | Check Organisation
            |--------------------------------------------------------------------------
            */

            const organisation =
                await Organisation.findByPk(
                    organisation_id,
                    {
                        transaction,
                    }
                );


            if (!organisation) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message:
                        "Organisation not found.",

                });

            }


            /*
            |--------------------------------------------------------------------------
            | Check Vendor
            |--------------------------------------------------------------------------
            */

            const vendor =
                await Vendors.findByPk(
                    vendor_id,
                    {
                        transaction,
                    }
                );


            if (!vendor) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message:
                        "Vendor not found.",

                });

            }


            /*
            |--------------------------------------------------------------------------
            | Check Warehouse
            |--------------------------------------------------------------------------
            */

            const warehouse =
                await Warehouses.findByPk(
                    warehouse_id,
                    {
                        transaction,
                    }
                );


            if (!warehouse) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message:
                        "Warehouse not found.",

                });

            }


            /*
            |--------------------------------------------------------------------------
            | Generate Receipt Number
            |--------------------------------------------------------------------------
            */

            const receipt_no =
                await generatePurchaseReceiptNo(
                    transaction
                );


            /*
            |--------------------------------------------------------------------------
            | Create Header
            |--------------------------------------------------------------------------
            */

            const receipt =
                await createPurchaseReceipt({

                    organisation_id,

                    vendor_id,

                    warehouse_id,

                    receipt_no,

                    receipt_date,

                    supplier_invoice_no:
                        supplier_invoice_no || null,

                    supplier_invoice_date:
                        supplier_invoice_date || null,

                    currency_code:
                        currency_code || "GBP",

                    status:
                        "DRAFT",

                }, transaction);


            let totalBasicAmount = 0;
            let totalDiscountAmount = 0;
            let totalTaxAmount = 0;
            let totalFreightAmount = 0;
            let totalOtherAmount = 0;
            let totalInvoiceAmount = 0;


            const createdLines = [];


            /*
            |--------------------------------------------------------------------------
            | Create Lines
            |--------------------------------------------------------------------------
            */

            for (
                let index = 0;
                index < lines.length;
                index++
            ) {

                const line =
                    lines[index];


                /*
                |--------------------------------------------------------------------------
                | Find Item
                |--------------------------------------------------------------------------
                */

                const item =
                    await Items.findByPk(
                        line.item_id,
                        {
                            transaction,
                        }
                    );


                if (!item) {

                    await transaction.rollback();

                    return res.status(404).json({

                        success: false,

                        message:
                            `Item ${line.item_id} not found.`,

                    });

                }


                /*
                |--------------------------------------------------------------------------
                | Check Purchase UOM
                |--------------------------------------------------------------------------
                */

                const purchaseUom =
                    await Units.findByPk(
                        line.purchase_uom_id,
                        {
                            transaction,
                        }
                    );


                if (!purchaseUom) {

                    await transaction.rollback();

                    return res.status(404).json({

                        success: false,

                        message:
                            `Purchase UOM ${line.purchase_uom_id} not found.`,

                    });

                }


                /*
                |--------------------------------------------------------------------------
                | Get Item Base UOM
                |--------------------------------------------------------------------------
                */

                const baseUom =
                    await Units.findByPk(
                        item.base_uom_id,
                        {
                            transaction,
                        }
                    );


                if (!baseUom) {

                    await transaction.rollback();

                    return res.status(404).json({

                        success: false,

                        message:
                            `Base UOM for item ${item.id} not found.`,

                    });

                }


                /*
                |--------------------------------------------------------------------------
                | UOM CONVERSION
                |--------------------------------------------------------------------------
                |
                | This is where ItemUomConversion is used.
                |
                */

                let conversionFactor = 1;


                /*
                |--------------------------------------------------------------------------
                | Same UOM
                |--------------------------------------------------------------------------
                */

                if (
                    Number(line.purchase_uom_id) ===
                    Number(item.base_uom_id)
                ) {

                    conversionFactor = 1;

                }


                /*
                |--------------------------------------------------------------------------
                | Different UOM
                |--------------------------------------------------------------------------
                */

                else {

                    const conversion =
                        await ItemUomConversion.findOne({

                            where: {

                                item_id:
                                    item.id,

                                from_uom_id:
                                    line.purchase_uom_id,

                                to_uom_id:
                                    item.base_uom_id,

                                is_purchase_conversion:
                                    true,

                                [require("sequelize").Op.or]: [

                                    {
                                        effective_from:
                                            null,
                                    },

                                    {
                                        effective_from: {
                                            [require("sequelize").Op.lte]:
                                                receipt_date,
                                        },
                                    },

                                ],

                                [require("sequelize").Op.and]: [

                                    {

                                        [require("sequelize").Op.or]: [

                                            {
                                                effective_to:
                                                    null,
                                            },

                                            {
                                                effective_to: {
                                                    [require("sequelize").Op.gte]:
                                                        receipt_date,
                                                },
                                            },

                                        ],

                                    },

                                ],

                            },

                            order: [
                                ["id", "DESC"],
                            ],

                            transaction,

                        });


                    if (!conversion) {

                        await transaction.rollback();

                        return res.status(400).json({

                            success: false,

                            message:
                                `No purchase UOM conversion found for item ${item.item_name} from ${purchaseUom.unit_name} to ${baseUom.unit_name}.`,

                        });

                    }


                    conversionFactor =
                        Number(
                            conversion.conversion_factor
                        );

                }


                /*
                |--------------------------------------------------------------------------
                | Accepted / Rejected Quantity
                |--------------------------------------------------------------------------
                */

                const receivedQty =
                    Number(
                        line.received_qty
                    );


                const acceptedQty =
                    line.accepted_qty !== undefined
                        ? Number(line.accepted_qty)
                        : receivedQty;


                const rejectedQty =
                    line.rejected_qty !== undefined
                        ? Number(line.rejected_qty)
                        : (
                            receivedQty -
                            acceptedQty
                        );


                if (
                    acceptedQty < 0 ||
                    rejectedQty < 0 ||
                    acceptedQty + rejectedQty >
                    receivedQty
                ) {

                    await transaction.rollback();

                    return res.status(400).json({

                        success: false,

                        message:
                            `Invalid quantity for item ${item.item_name}.`,

                    });

                }


                /*
                |--------------------------------------------------------------------------
                | Convert To Base UOM
                |--------------------------------------------------------------------------
                */

                const acceptedBaseQty =
                    acceptedQty *
                    conversionFactor;


                /*
                |--------------------------------------------------------------------------
                | Amount Calculation
                |--------------------------------------------------------------------------
                */

                const basicUnitPrice =
                    Number(
                        line.basic_unit_price
                    );


                const basicAmount =
                    receivedQty *
                    basicUnitPrice;


                const discountAmount =
                    Number(
                        line.discount_amount || 0
                    );


                const taxAmount =
                    Number(
                        line.tax_amount || 0
                    );


                const freightAmount =
                    Number(
                        line.freight_amount || 0
                    );


                const otherChargeAmount =
                    Number(
                        line.other_charge_amount || 0
                    );


                const taxableAmount =
                    basicAmount -
                    discountAmount;


                const lineNetAmount =
                    taxableAmount +
                    taxAmount +
                    freightAmount +
                    otherChargeAmount;


                /*
                |--------------------------------------------------------------------------
                | Inventory Unit Cost
                |--------------------------------------------------------------------------
                |
                | For now this treats tax + freight + other charges
                | as inventory cost.
                |
                | If tax is recoverable, adjust this formula according
                | to your accounting policy.
                |
                */

                const inventoryUnitCost =
                    acceptedBaseQty > 0
                        ? (
                            (
                                taxableAmount +
                                taxAmount +
                                freightAmount +
                                otherChargeAmount
                            ) /
                            acceptedBaseQty
                        )
                        : 0;


                /*
                |--------------------------------------------------------------------------
                | Create Line
                |--------------------------------------------------------------------------
                */

                const createdLine =
                    await createPurchaseReceiptLine({

                        purchase_receipt_id:
                            receipt.id,

                        line_no:
                            index + 1,

                        item_id:
                            item.id,

                        supplier_batch_no:
                            line.supplier_batch_no ||
                            null,

                        internal_lot_no:
                            line.internal_lot_no,

                        manufacturing_date:
                            line.manufacturing_date ||
                            null,

                        expiry_date:
                            line.expiry_date ||
                            null,

                        received_qty:
                            receivedQty,

                        accepted_qty:
                            acceptedQty,

                        rejected_qty:
                            rejectedQty,

                        purchase_uom_id:
                            line.purchase_uom_id,

                        base_uom_id:
                            item.base_uom_id,

                        conversion_factor:
                            conversionFactor,

                        accepted_base_qty:
                            acceptedBaseQty,

                        basic_unit_price:
                            basicUnitPrice,

                        discount_amount:
                            discountAmount,

                        tax_amount:
                            taxAmount,

                        freight_amount:
                            freightAmount,

                        other_charge_amount:
                            otherChargeAmount,

                        line_net_amount:
                            lineNetAmount,

                        inventory_unit_cost:
                            inventoryUnitCost,

                        quality_status:
                            "PENDING",

                    }, transaction);


                createdLines.push(
                    createdLine
                );


                /*
                |--------------------------------------------------------------------------
                | Header Totals
                |--------------------------------------------------------------------------
                */

                totalBasicAmount +=
                    basicAmount;

                totalDiscountAmount +=
                    discountAmount;

                totalTaxAmount +=
                    taxAmount;

                totalFreightAmount +=
                    freightAmount;

                totalOtherAmount +=
                    otherChargeAmount;

                totalInvoiceAmount +=
                    lineNetAmount;

            }


            /*
            |--------------------------------------------------------------------------
            | Update Header Totals
            |--------------------------------------------------------------------------
            */

            await updatePurchaseReceipt(

                receipt.id,

                {

                    total_basic_amount:
                        totalBasicAmount,

                    total_discount_amount:
                        totalDiscountAmount,

                    total_tax_amount:
                        totalTaxAmount,

                    total_freight_amount:
                        totalFreightAmount,

                    total_other_amount:
                        totalOtherAmount,

                    total_invoice_amount:
                        totalInvoiceAmount,

                },

                transaction

            );


            await transaction.commit();


            /*
            |--------------------------------------------------------------------------
            | Return Complete Receipt
            |--------------------------------------------------------------------------
            */

            const result =
                await findPurchaseReceiptById(
                    receipt.id
                );


            return res.status(201).json({

                success: true,

                message:
                    "Purchase receipt created successfully.",

                data:
                    result,

            });


        } catch (error) {

            console.error(error);

            await transaction.rollback();

            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Something went wrong while creating purchase receipt.",

            });

        }

    }


    /*
    |--------------------------------------------------------------------------
    | List
    |--------------------------------------------------------------------------
    */

    static async list(req, res) {

        try {

            let page =
                Number(req.query.page) || 1;

            let limit =
                Number(req.query.limit) || 10;

            page =
                Math.max(page, 1);

            limit =
                Math.max(limit, 1);


            const result =
                await getAllPurchaseReceipts({

                    page,

                    limit,

                    search:
                        req.query.search,

                    organisation_id:
                        req.query.organisation_id,

                    vendor_id:
                        req.query.vendor_id,

                    warehouse_id:
                        req.query.warehouse_id,

                    status:
                        req.query.status,

                });


            return res.status(200).json({

                success: true,

                totalRecords:
                    result.count,

                totalPages:
                    Math.ceil(
                        result.count / limit
                    ),

                currentPage:
                    page,

                data:
                    result.rows,

            });


        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message:
                    error.message,

            });

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Get By ID
    |--------------------------------------------------------------------------
    */

    static async getById(req, res) {

        try {

            const receipt =
                await findPurchaseReceiptById(
                    req.params.id
                );


            if (!receipt) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Purchase receipt not found.",

                });

            }


            return res.status(200).json({

                success: true,

                data:
                    receipt,

            });


        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message:
                    error.message,

            });

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Change Status
    |--------------------------------------------------------------------------
    */

    static async updateStatus(req, res) {

        const transaction =
            await sequelize.transaction();

        try {

            const receipt =
                await findPurchaseReceiptById(
                    req.params.id,
                    transaction
                );


            if (!receipt) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message:
                        "Purchase receipt not found.",

                });

            }


            const {
                status,
            } = req.body;


            const allowedTransitions = {

                DRAFT: [
                    "RECEIVED",
                    "CANCELLED",
                ],

                RECEIVED: [
                    "QC_PENDING",
                    "COMPLETED",
                    "CANCELLED",
                ],

                QC_PENDING: [
                    "COMPLETED",
                    "CANCELLED",
                ],

                COMPLETED: [],

                CANCELLED: [],

            };


            if (
                !allowedTransitions[
                    receipt.status
                ]?.includes(status)
            ) {

                await transaction.rollback();

                return res.status(400).json({

                    success: false,

                    message:
                        `Cannot change receipt status from ${receipt.status} to ${status}.`,

                });

            }


            await updatePurchaseReceipt(

                receipt.id,

                {
                    status,
                },

                transaction

            );


            await transaction.commit();


            return res.status(200).json({

                success: true,

                message:
                    "Purchase receipt status updated successfully.",

            });


        } catch (error) {

            console.error(error);

            await transaction.rollback();

            return res.status(500).json({

                success: false,

                message:
                    error.message,

            });

        }

    }

}


module.exports = PurchaseReceiptController;