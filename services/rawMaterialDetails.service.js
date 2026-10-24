const {
    RawMaterialDetails,
    Items,
} = require("../models");

/**
 * Create Raw Material Details
 */
const createRawMaterial = async (payload) => {

    return await RawMaterialDetails.create(payload);

};

/**
 * Find Raw Material By Item Id
 */
const findByItemId = async (itemId) => {

    return await RawMaterialDetails.findOne({

        where: {
            item_id: itemId,
        },

        include: [
            {
                model: Items,
                as: "item",
            },
        ],

    });

};

/**
 * Check Item Already Has Raw Material Details
 */
const exists = async (itemId) => {

    return await RawMaterialDetails.findOne({

        where: {
            item_id: itemId,
        },

    });

};

/**
 * Update Raw Material Details
 */
const updateRawMaterial = async (
    itemId,
    payload
) => {

    return await RawMaterialDetails.update(
        payload,
        {
            where: {
                item_id: itemId,
            },
        }
    );

};

/**
 * Delete Raw Material Details
 */
const deleteRawMaterial = async (itemId) => {

    return await RawMaterialDetails.destroy({

        where: {
            item_id: itemId,
        },

    });

};

/**
 * List Raw Materials
 */
const listRawMaterials = async ({
    page = 1,
    limit = 10,
    search = "",
}) => {

    const offset = (page - 1) * limit;

    const { Op } = require("sequelize");

    return await RawMaterialDetails.findAndCountAll({

        include: [
            {
                model: Items,
                as: "item",

                where: {

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

                    item_type: "RAW_MATERIAL",
                },
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

    createRawMaterial,

    findByItemId,

    exists,

    updateRawMaterial,

    deleteRawMaterial,

    listRawMaterials,

};