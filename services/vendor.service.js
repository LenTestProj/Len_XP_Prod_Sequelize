const { Op } = require("sequelize");

const {
    Vendors,
    VendorItem,
    VendorItemPriceHistory,
    Items,
    Units,
    Organisation,
} = require("../models");


/*
|--------------------------------------------------------------------------
| Create Vendor
|--------------------------------------------------------------------------
*/

const createVendor = async (
    payload,
    transaction = null
) => {

    return await Vendors.create(
        payload,
        { transaction }
    );

};


/*
|--------------------------------------------------------------------------
| Find Vendor By ID
|--------------------------------------------------------------------------
*/

const findVendorById = async (
    id,
    transaction = null
) => {

    return await Vendors.findOne({

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
                model: VendorItem,
                as: "items",

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
                            "name",
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
| Find Vendor By Code
|--------------------------------------------------------------------------
*/

const findVendorByCode = async (
    organisation_id,
    vendor_code,
    transaction = null
) => {

    return await Vendors.findOne({

        where: {
            organisation_id,
            vendor_code,
        },

        transaction,

    });

};


/*
|--------------------------------------------------------------------------
| Update Vendor
|--------------------------------------------------------------------------
*/

const updateVendor = async (
    id,
    data,
    transaction = null
) => {

    return await Vendors.update(

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
| Delete Vendor
|--------------------------------------------------------------------------
*/

const deleteVendor = async (
    id,
    transaction = null
) => {

    return await Vendors.destroy({

        where: {
            id,
        },

        transaction,

    });

};


/*
|--------------------------------------------------------------------------
| Get All Vendors
|--------------------------------------------------------------------------
*/

const getAllVendors = async ({
    page = 1,
    limit = 10,
    search = "",
    organisation_id,
}) => {

    const offset =
        (page - 1) * limit;

    const where = {};

    if (organisation_id) {

        where.organisation_id =
            organisation_id;

    }

    if (search) {

        where[Op.or] = [

            {
                vendor_code: {
                    [Op.like]: `%${search}%`,
                },
            },

            {
                vendor_name: {
                    [Op.like]: `%${search}%`,
                },
            },

            {
                tax_registration_no: {
                    [Op.like]: `%${search}%`,
                },
            },

        ];

    }

    return await Vendors.findAndCountAll({

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

        ],

        offset,
        limit,

        distinct: true,

        order: [
            ["id", "DESC"],
        ],

    });

};


/*
|--------------------------------------------------------------------------
| Create Vendor Item
|--------------------------------------------------------------------------
*/

const createVendorItem = async (
    payload,
    transaction = null
) => {

    return await VendorItem.create(
        payload,
        { transaction }
    );

};


/*
|--------------------------------------------------------------------------
| Find Vendor Item
|--------------------------------------------------------------------------
*/

const findVendorItemById = async (
    id,
    transaction = null
) => {

    return await VendorItem.findOne({

        where: {
            id,
        },

        include: [

            {
                model: Vendors,
                as: "vendor",
                attributes: [
                    "id",
                    "vendor_code",
                    "vendor_name",
                ],
            },

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
                    "name",
                ],
            },

            {
                model: VendorItemPriceHistory,
                as: "priceHistory",

                required: false,

                order: [
                    ["effective_from", "DESC"],
                ],

            },

        ],

        transaction,

    });

};


/*
|--------------------------------------------------------------------------
| Get Vendor Items
|--------------------------------------------------------------------------
*/

const getVendorItems = async (
    vendor_id,
    transaction = null
) => {

    return await VendorItem.findAll({

        where: {
            vendor_id,
        },

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
                    "name",
                ],
            },

            {
                model: VendorItemPriceHistory,
                as: "priceHistory",

                required: false,

                order: [
                    ["effective_from", "DESC"],
                ],

            },

        ],

        order: [
            ["id", "DESC"],
        ],

        transaction,

    });

};


/*
|--------------------------------------------------------------------------
| Update Vendor Item
|--------------------------------------------------------------------------
*/

const updateVendorItem = async (
    id,
    data,
    transaction = null
) => {

    return await VendorItem.update(

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
| Delete Vendor Item
|--------------------------------------------------------------------------
*/

const deleteVendorItem = async (
    id,
    transaction = null
) => {

    return await VendorItem.destroy({

        where: {
            id,
        },

        transaction,

    });

};


/*
|--------------------------------------------------------------------------
| Create Vendor Item Price
|--------------------------------------------------------------------------
*/

const createVendorItemPrice = async (
    payload,
    transaction = null
) => {

    return await VendorItemPriceHistory.create(
        payload,
        { transaction }
    );

};


/*
|--------------------------------------------------------------------------
| Get Vendor Item Prices
|--------------------------------------------------------------------------
*/

const getVendorItemPrices = async (
    vendor_item_id,
    transaction = null
) => {

    return await VendorItemPriceHistory.findAll({

        where: {
            vendor_item_id,
        },

        order: [
            ["effective_from", "DESC"],
            ["id", "DESC"],
        ],

        transaction,

    });

};


/*
|--------------------------------------------------------------------------
| Find Vendor Item Price
|--------------------------------------------------------------------------
*/

const findVendorItemPriceById = async (
    id,
    transaction = null
) => {

    return await VendorItemPriceHistory.findOne({

        where: {
            id,
        },

        transaction,

    });

};


/*
|--------------------------------------------------------------------------
| Update Vendor Item Price
|--------------------------------------------------------------------------
*/

const updateVendorItemPrice = async (
    id,
    data,
    transaction = null
) => {

    return await VendorItemPriceHistory.update(

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
| Delete Vendor Item Price
|--------------------------------------------------------------------------
*/

const deleteVendorItemPrice = async (
    id,
    transaction = null
) => {

    return await VendorItemPriceHistory.destroy({

        where: {
            id,
        },

        transaction,

    });

};


module.exports = {

    createVendor,
    findVendorById,
    findVendorByCode,
    updateVendor,
    deleteVendor,
    getAllVendors,

    createVendorItem,
    findVendorItemById,
    getVendorItems,
    updateVendorItem,
    deleteVendorItem,

    createVendorItemPrice,
    getVendorItemPrices,
    findVendorItemPriceById,
    updateVendorItemPrice,
    deleteVendorItemPrice,

};