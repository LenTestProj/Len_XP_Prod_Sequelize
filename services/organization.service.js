const { Op } = require("sequelize");

const {
    Organisation,
} = require("../models");

/**
 * Find Organisation By Code
 */
const findOrganisationByCode = async (
    organisationCode,
    excludeId = null
) => {

    const where = {
        organisation_code: organisationCode,
    };

    if (excludeId) {
        where.id = {
            [Op.ne]: excludeId,
        };
    }

    return await Organisation.findOne({
        where,
    });

};

/**
 * Find Organisation By Id
 */
const findOrganisationById = async (id) => {

    return await Organisation.findByPk(id);

};

/**
 * Create Organisation
 */
const createOrganisation = async (payload) => {

    return await Organisation.create(payload);

};

/**
 * Get Organisations
 */
const getOrganisations = async ({
    page = 1,
    limit = 10,
    search = "",
    sortBy = "created_at",
    sortOrder = "DESC",
}) => {

    const offset = (page - 1) * limit;

    const where = {};

    if (search) {

        where[Op.or] = [
            {
                organisation_code: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                organisation_name: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                base_currency: {
                    [Op.like]: `%${search}%`,
                },
            },
        ];

    }

    return await Organisation.findAndCountAll({

        where,

        limit: Number(limit),

        offset: Number(offset),

        order: [
            [sortBy, sortOrder.toUpperCase()],
        ],

    });

};

/**
 * Update Organisation
 */
const updateOrganisation = async (
    organisation,
    payload
) => {

    return await organisation.update(payload);

};

/**
 * Delete Organisation
 */
const deleteOrganisation = async (
    organisation
) => {

    return await organisation.destroy();

};

module.exports = {

    findOrganisationByCode,

    findOrganisationById,

    createOrganisation,

    getOrganisations,

    updateOrganisation,

    deleteOrganisation,

};