const { Op } = require("sequelize");

const {
    PurchaseReceipts,
    PurchaseReceiptLines,
    VendorItem,
    VendorItemPriceHistory,
    Items,
    Units,
    Organisation,
    Vendors,
} = require("../models");


/*
|--------------------------------------------------------------------------
| Create Purchase Receipt
|--------------------------------------------------------------------------
*/

const createPurchaseReceipt = async (
    payload,
    transaction = null
) => {

    return await PurchaseReceipts.create(
        payload,
        { transaction }
    );

};


/*
|--------------------------------------------------------------------------
| Create Purchase Receipt Line
|--------------------------------------------------------------------------
*/

const createPurchaseReceiptLine = async (
    payload,
    transaction = null
) => {

    return await PurchaseReceiptLines.create(
        payload,
        { transaction }
    );

};


/*
|--------------------------------------------------------------------------
| Find Receipt By ID
|--------------------------------------------------------------------------
*/

const findPurchaseReceiptById = async (
    id,
    transaction = null
) => {

    return await PurchaseReceipts.findOne({

        where: {
            id,
        },

        include: [

            {
                model: Organisation,
                as: "organisation",

                attributes: [
                    "id",
                    "organisation_code",
                    "organisation_name",
                ],

            },

            {
                model: Vendors,
                as: "vendor",

            },

            {
                model: PurchaseReceiptLines,
                as: "lines",

                required: false,

                include: [

                    {
                        model: Items,
                        as: "item",

                        attributes: [
                            "id",
                            "item_code",
                            "item_name",
                            "item_type",
                            "base_uom_id",
                        ],

                    },

                    {
                        model: Units,
                        as: "purchaseUom",

                        attributes: [
                            "id",
                            "unit_code",
                            "unit_name",
                        ],

                    },

                    {
                        model: Units,
                        as: "baseUom",

                        attributes: [
                            "id",
                            "unit_code",
                            "unit_name",
                        ],

                    },

                ],

            },

        ],

        transaction,

    });

};


/*
|--------------------------------------------------------------------------
| Find Receipt By Number
|--------------------------------------------------------------------------
*/

const findPurchaseReceiptByNo = async (
    receipt_no,
    transaction = null
) => {

    return await PurchaseReceipts.findOne({

        where: {
            receipt_no,
        },

        transaction,

    });

};


/*
|--------------------------------------------------------------------------
| Update Receipt
|--------------------------------------------------------------------------
*/

const updatePurchaseReceipt = async (
    id,
    data,
    transaction = null
) => {

    return await PurchaseReceipts.update(

        data,

        {
            where: {
                id,
            },

            transaction,
        }

    );

};


/*
|--------------------------------------------------------------------------
| Get All Purchase Receipts
|--------------------------------------------------------------------------
*/

const getAllPurchaseReceipts = async ({

    page = 1,
    limit = 10,
    search = "",
    organisation_id,
    vendor_id,
    warehouse_id,
    status,

}) => {

    const offset =
        (page - 1) * limit;

    const where = {};

    if (organisation_id) {

        where.organisation_id =
            organisation_id;

    }

    if (vendor_id) {

        where.vendor_id =
            vendor_id;

    }

    if (warehouse_id) {

        where.warehouse_id =
            warehouse_id;

    }

    if (status) {

        where.status =
            status;

    }

    if (search) {

        where[Op.or] = [

            {
                receipt_no: {
                    [Op.like]:
                        `%${search}%`,
                },
            },

            {
                supplier_invoice_no: {
                    [Op.like]:
                        `%${search}%`,
                },
            },

        ];

    }


    return await PurchaseReceipts.findAndCountAll({

        where,

        include: [

            {
                model: Organisation,
                as: "organisation",

                attributes: [
                    "id",
                    "organisation_code",
                    "organisation_name",
                ],

            },

            {
                model: Vendors,
                as: "vendor",

            },

        ],

        offset,

        limit,

        distinct: true,

        order: [
            ["id", "DESC"],
        ],

    });

};


module.exports = {
    createPurchaseReceipt,
    createPurchaseReceiptLine,
    findPurchaseReceiptById,
    findPurchaseReceiptByNo,
    updatePurchaseReceipt,
    getAllPurchaseReceipts,

};