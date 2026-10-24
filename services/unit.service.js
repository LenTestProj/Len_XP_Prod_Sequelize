const { Op } = require("sequelize");

const { Units } = require("../models");

/**
 * Create Unit
 */
const createUnit = async (payload) => {

    return await Units.create(payload);

};

/**
 * Find Unit By ID
 */
const findUnitById = async (id) => {

    return await Units.findOne({

        where: {
            id,
            is_deleted: false,
        },

    });

};

/**
 * Find Unit By Name
 */
const findUnitByName = async (name, excludeId = null) => {

    const where = {
        name,
        is_deleted: false,
    };

    if (excludeId) {
        where.id = {
            [Op.ne]: excludeId,
        };
    }

    return await Units.findOne({ where });

};

/**
 * Find Unit By Code
 */
const findUnitByCode = async (code, excludeId = null) => {

    const where = {
        code,
        is_deleted: false,
    };

    if (excludeId) {
        where.id = {
            [Op.ne]: excludeId,
        };
    }

    return await Units.findOne({ where });

};

/**
 * Get Units
 */
const getUnits = async ({
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
                name: {
                    [Op.like]: `%${search}%`,
                },
            },

            {
                code: {
                    [Op.like]: `%${search}%`,
                },
            },

        ];

    }

    return await Units.findAndCountAll({

        where,

        limit: Number(limit),

        offset,

        order: [
            [sortBy, sortOrder],
        ],

    });

};

/**
 * Update Unit
 */
const updateUnit = async (unit, payload) => {

    return await unit.update(payload);

};

/**
 * Soft Delete Unit
 */
const deleteUnit = async (unit) => {

    return await unit.update({
        is_deleted: true,
    });

};

module.exports = {

    createUnit,

    findUnitById,

    findUnitByName,

    findUnitByCode,

    getUnits,

    updateUnit,

    deleteUnit,

};