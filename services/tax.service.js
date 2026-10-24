const { Op } = require("sequelize");

const { Taxes } = require("../models");

/**
 * Create Tax
 */
const createTax = async (payload) => {

    return await Taxes.create(payload);

};

/**
 * Find Tax By ID
 */
const findTaxById = async (id) => {

    return await Taxes.findOne({

        where: {
            id,
            is_deleted: false,
        },

    });

};

/**
 * Find Tax By HSN Code
 */
const findTaxByHsnCode = async (
    hsn_code,
    excludeId = null
) => {

    const where = {
        hsn_code,
        is_deleted: false,
    };

    if (excludeId) {

        where.id = {
            [Op.ne]: excludeId,
        };

    }

    return await Taxes.findOne({
        where,
    });

};

/**
 * Tax List
 */
const getTaxes = async ({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
}) => {

    const offset = (page - 1) * limit;

    const where = {
        is_deleted: false,
    };

    if (search) {

        where[Op.or] = [

            {
                hsn_code: {
                    [Op.like]: `%${search}%`,
                },
            },

            {
                description: {
                    [Op.like]: `%${search}%`,
                },
            },

            {
                taxType: {
                    [Op.like]: `%${search}%`,
                },
            },

        ];

    }

    return await Taxes.findAndCountAll({

        where,

        limit: Number(limit),

        offset,

        order: [[sortBy, sortOrder]],

    });

};

/**
 * Update Tax
 */
const updateTax = async (tax, payload) => {

    return await tax.update(payload);

};

/**
 * Soft Delete Tax
 */
const deleteTax = async (tax) => {

    return await tax.update({

        is_deleted: true,

    });

};

module.exports = {

    createTax,

    findTaxById,

    findTaxByHsnCode,

    getTaxes,

    updateTax,

    deleteTax,

};