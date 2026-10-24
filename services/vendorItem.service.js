const { Op } = require("sequelize");

const {
    VendorItem,
    VendorItemPriceHistory,
    Vendors,
    Items,
    Units,
} = require("../models");


/**
 * Create Vendor Item
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


/**
 * Create Price History
 */
const createPriceHistory = async (
    payload,
    transaction = null
) => {

    return await VendorItemPriceHistory.create(
        payload,
        { transaction }
    );
};


/**
 * Find Vendor Item
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
                    "organisation_id",
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
                    "code",
                    "name",
                ],
            },

            {
                model: VendorItemPriceHistory,
                as: "priceHistory",

                include: [
                    {
                        model: Units,
                        as: "priceUom",
                        attributes: [
                            "id",
                            "code",
                            "name",
                        ],
                    },
                ],

                required: false,
            },
        ],

        transaction,
    });
};


/**
 * Find Vendor Item
 */
const findVendorItem = async (
    vendor_id,
    item_id,
    transaction = null
) => {

    return await VendorItem.findOne({

        where: {
            vendor_id,
            item_id,
        },

        transaction,
    });
};


/**
 * Find Price By ID
 */
const findPriceHistoryById = async (
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


/**
 * Update Vendor Item
 */
const updateVendorItem = async (
    id,
    data,
    transaction = null
) => {

    return await VendorItem.update(
        data,
        {
            where: { id },
            transaction,
        }
    );
};


/**
 * Update Price History
 */
const updatePriceHistory = async (
    id,
    data,
    transaction = null
) => {

    return await VendorItemPriceHistory.update(
        data,
        {
            where: { id },
            transaction,
        }
    );
};


/**
 * Get Vendor Items
 */
const getVendorItems = async ({
    vendor_id,
    page = 1,
    limit = 10,
    search = "",
    item_id,
    is_active,
}) => {

    const offset = (page - 1) * limit;

    const where = {
        vendor_id,
    };

    if (item_id) {
        where.item_id = item_id;
    }

    if (is_active !== undefined) {
        where.is_active = is_active;
    }

    const include = [

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
                "code",
                "name",
            ],
        },

        {
            model: VendorItemPriceHistory,
            as: "priceHistory",

            required: false,

            include: [
                {
                    model: Units,
                    as: "priceUom",
                    attributes: [
                        "id",
                        "code",
                        "name",
                    ],
                },
            ],
        },
    ];

    if (search) {

        include[0].where = {
            [Op.or]: [
                {
                    item_code: {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    item_name: {
                        [Op.like]: `%${search}%`,
                    },
                },
            ],
        };
    }

    return await VendorItem.findAndCountAll({

        where,

        include,

        offset,
        limit,

        distinct: true,

        order: [
            ["id", "DESC"],
        ],
    });
};


/**
 * Delete Vendor Item
 *
 * Recommended to deactivate instead of hard delete
 */
const deactivateVendorItem = async (
    id,
    transaction = null
) => {

    return await VendorItem.update(
        {
            is_active: false,
        },
        {
            where: { id },
            transaction,
        }
    );
};


module.exports = {

    createVendorItem,
    createPriceHistory,

    findVendorItemById,
    findVendorItem,

    findPriceHistoryById,

    updateVendorItem,
    updatePriceHistory,

    getVendorItems,

    deactivateVendorItem,
};