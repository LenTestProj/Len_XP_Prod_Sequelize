const { Op } = require("sequelize");

const {
    Items,
    Organisation,
    Units,
    RawMaterialDetails,
    PackagingMaterialDetails,
    FinishedProductDetails
} = require("../models");

/**
 * Create Item
 */
// const createItem = async (payload) => {

//     return await Items.create(payload);

// };
const createItem = async (
    payload,
    transaction = null
) => {

    return await Items.create(
        payload,
        { transaction }
    );

};

/**
 * Find Item By Id
 */
// const findById = async (id) => {

//     return await Items.findOne({

//         where: {
//             id,
//             is_active: true,
//         },

//         include: [
//             {
//                 model: Organisation,
//                 as: "organisation",
//                 attributes: [
//                     "id",
//                     "organisation_code",
//                     "organisation_name",
//                 ],
//             },
//             {
//                 model: Units,
//                 as: "baseUom",
//                 attributes: [
//                     "id",
//                     "code",
//                     "name",
//                 ],
//             },
//         ],

//     });

// };
const findById = async (id) => {

    return await Items.findOne({

        where: {
            id,
            // is_active: true,
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
                model: Units,
                as: "baseUom",
                attributes: [
                    "id",
                    "code",
                    "name",
                ],
            },

            {
                model: RawMaterialDetails,
                as: "rawMaterialDetails",
                required: false,
            },

            {
                model: PackagingMaterialDetails,
                as: "packagingMaterialDetails",
                required: false,
                include: [
                    {
                        model: Units,
                        as: "capacityUom",
                        attributes: [
                            "id",
                            "code",
                            "name",
                        ],
                    },
                ],
            },

            {
                model: FinishedProductDetails,
                as: "finishedProductDetails",
                required: false,
                include: [
                    {
                        model: Units,
                        as: "netContentUom",
                        attributes: [
                            "id",
                            "code",
                            "name",
                        ],
                    },
                ],
            },

        ],

    });

};
/**
 * Find By Item Code
 */
const findByCode = async (
    organisation_id,
    item_code
) => {

    return await Items.findOne({

        where: {
            organisation_id,
            item_code,
        },

    });

};

/**
 * Update Item
 */
// const updateItem = async (
//     id,
//     payload
// ) => {

//     return await Items.update(
//         payload,
//         {
//             where: {
//                 id,
//             },
//         }
//     );

// };
const updateItem = async (id, data, transaction) => {

    return await Items.update(data, {
        where: {
            id,
        },
        transaction,
    });

};
/**
 * Soft Delete Item
 */
// const deleteItem = async (id) => {

//     return await Items.update(
//         {
//             is_active: false,
//         },
//         {
//             where: {
//                 id,
//             },
//         }
//     );

// };
const deleteItem = async (id, transaction) => {

    return await Items.destroy({
        where: {
            id,
        },
        transaction,
    });

};
/**
 * Get All Items
 */
// const getAllItems = async ({
//     page = 1,
//     limit = 10,
//     search = "",
//     organisation_id,
//     item_type,
// }) => {

//     const offset = (page - 1) * limit;

//     const where = {
//         is_active: true,
//     };

//     if (organisation_id) {
//         where.organisation_id = organisation_id;
//     }

//     if (item_type) {
//         where.item_type = item_type;
//     }

//     if (search) {

//         where[Op.or] = [
//             {
//                 item_code: {
//                     [Op.like]: `%${search}%`,
//                 },
//             },
//             {
//                 item_name: {
//                     [Op.like]: `%${search}%`,
//                 },
//             },
//         ];

//     }

//     return await Items.findAndCountAll({

//         where,

//         include: [
//             {
//                 model: Organisation,
//                 as: "organisation",
//                 attributes: [
//                     "id",
//                     "organisation_code",
//                     "organisation_name",
//                 ],
//             },
//             {
//                 model: Units,
//                 as: "baseUom",
//                 attributes: [
//                     "id",
//                     "code",
//                     "name",
//                 ],
//             },
//         ],

//         offset,
//         limit,

//         order: [
//             ["id", "DESC"],
//         ],

//     });

// };
const getAllItems = async ({
    page = 1,
    limit = 10,
    search = "",
    organisation_id,
    item_type,
}) => {

    const offset = (page - 1) * limit;

    const where = {
        // is_active: true,
    };

    if (organisation_id) {
        where.organisation_id = organisation_id;
    }

    if (item_type) {
        where.item_type = item_type;
    }

    if (search) {

        where[Op.or] = [
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
        ];

    }

    return await Items.findAndCountAll({

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
                model: Units,
                as: "baseUom",
                attributes: [
                    "id",
                    "code",
                    "name",
                ],
            },

            {
                model: RawMaterialDetails,
                as: "rawMaterialDetails",
                required: false,
            },

            {
                model: PackagingMaterialDetails,
                as: "packagingMaterialDetails",
                required: false,
                include: [
                    {
                        model: Units,
                        as: "capacityUom",
                        attributes: [
                            "id",
                            "code",
                            "name",
                        ],
                    },
                ],
            },

            {
                model: FinishedProductDetails,
                as: "finishedProductDetails",
                required: false,
                include: [
                    {
                        model: Units,
                        as: "netContentUom",
                        attributes: [
                            "id",
                            "code",
                            "name",
                        ],
                    },
                ],
            },

        ],

        offset,
        limit,

        order: [
            ["id", "DESC"],
        ],

    });

};

module.exports = {

    createItem,

    findById,

    findByCode,

    updateItem,

    deleteItem,

    getAllItems,

};