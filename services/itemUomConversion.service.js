const { Op } = require("sequelize");

const {
    ItemUomConversion,
    Items,
    Units,
} = require("../models");

/**
 * Create Conversion
 */
const createConversion = async (payload) => {

    return await ItemUomConversion.create(payload);

};

/**
 * Find Conversion By Id
 */
const findById = async (id) => {

    return await ItemUomConversion.findOne({

        where: {
            id,
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
                ],
            },
            {
                model: Units,
                as: "fromUom",
                attributes: [
                    "id",
                    "code",
                    "name",
                ],
            },
            {
                model: Units,
                as: "toUom",
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
 * Find Duplicate Conversion
 */
const findDuplicate = async (
    itemId,
    fromUomId,
    toUomId,
    effectiveFrom,
    excludeId = null
) => {

    const where = {

        item_id: itemId,

        from_uom_id: fromUomId,

        to_uom_id: toUomId,

        effective_from: effectiveFrom || null,

    };

    if (excludeId) {

        where.id = {
            [Op.ne]: excludeId,
        };

    }

    return await ItemUomConversion.findOne({
        where,
    });

};

/**
 * Update Conversion
 */
const updateConversion = async (
    id,
    payload
) => {

    return await ItemUomConversion.update(
        payload,
        {
            where: {
                id,
            },
        }
    );

};

/**
 * Delete Conversion
 */
const deleteConversion = async (id) => {

    return await ItemUomConversion.destroy({

        where: {
            id,
        },

    });

};

/**
 * List Conversions
 */
const listConversions = async ({
    page = 1,
    limit = 10,
    search = "",
}) => {

    const offset = (page - 1) * limit;

    return await ItemUomConversion.findAndCountAll({

        include: [

            {
                model: Items,
                as: "item",

                attributes: [
                    "id",
                    "item_code",
                    "item_name",
                    "item_type",
                ],

                where: search
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
                    : undefined,
            },

            {
                model: Units,
                as: "fromUom",

                attributes: [
                    "id",
                    "code",
                    "name",
                ],
            },

            {
                model: Units,
                as: "toUom",

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
            ["id", "DESC"],
        ],

    });

};

module.exports = {

    createConversion,

    findById,

    findDuplicate,

    updateConversion,

    deleteConversion,

    listConversions,

};