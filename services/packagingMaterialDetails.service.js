const { Op } = require("sequelize");

const {
    PackagingMaterialDetails,
    Items,
    Units,
} = require("../models");

/**
 * Create Packaging Material
 */
const createPackagingMaterial = async (payload) => {

    return await PackagingMaterialDetails.create(payload);

};

/**
 * Find Packaging Material By Item Id
 */
const findByItemId = async (itemId) => {

    return await PackagingMaterialDetails.findOne({

        where: {
            item_id: itemId,
        },

        include: [
            {
                model: Items,
                as: "item",
            },
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

    });

};

/**
 * Check Existing Packaging Material
 */
const exists = async (itemId) => {

    return await PackagingMaterialDetails.findOne({

        where: {
            item_id: itemId,
        },

    });

};

/**
 * Update Packaging Material
 */
const updatePackagingMaterial = async (
    itemId,
    payload
) => {

    return await PackagingMaterialDetails.update(
        payload,
        {
            where: {
                item_id: itemId,
            },
        }
    );

};

/**
 * Delete Packaging Material
 */
const deletePackagingMaterial = async (itemId) => {

    return await PackagingMaterialDetails.destroy({

        where: {
            item_id: itemId,
        },

    });

};

/**
 * List Packaging Materials
 */
const listPackagingMaterials = async ({
    page = 1,
    limit = 10,
    search = "",
}) => {

    const offset = (page - 1) * limit;

    return await PackagingMaterialDetails.findAndCountAll({

        include: [
            {
                model: Items,
                as: "item",

                where: {

                    item_type: "PACKAGING_MATERIAL",

                    ...(search
                        ? {
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
                          }
                        : {}),

                },

            },

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

        offset,

        limit,

        order: [
            ["item_id", "DESC"],
        ],

    });

};

module.exports = {

    createPackagingMaterial,

    findByItemId,

    exists,

    updatePackagingMaterial,

    deletePackagingMaterial,

    listPackagingMaterials,

};