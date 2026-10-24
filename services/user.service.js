const { Op } = require("sequelize");

const {
    Users,
    AdminRoles,
    Organisation
} = require("../models");

/**
 * Create Admin User
 */
const createUser = async (payload) => {

    return await Users.create(payload);

};

/**
 * Find By ID
 */
const findUserById = async (id) => {

    return await Users.findOne({

        where: {
            id,
            is_deleted: false,
        },

        include: [
            {
                model: AdminRoles,
                as: "role",
                attributes: [
                    "id",
                    "name",
                    "description",
                    "status",
                ],
            },
            {
                model: Organisation,
                as: "organisation",
                attributes: [
                    "id",
                    "organisation_code",
                    "organisation_name",
                    "base_currency",
                    "is_active",
                ],
            },

        ],

    });

};

/**
 * Find By Email
 */
const findUserByEmail = async (
    email,
    excludeId = null
) => {

    const where = {

        email,

        is_deleted: false,

    };

    if (excludeId) {

        where.id = {

            [Op.ne]: excludeId,

        };

    }

    return await Users.findOne({
        where,
    });

};

/**
 * Find By Mobile
 */
const findUserByMobile = async (
    mobile,
    excludeId = null
) => {

    const where = {

        mobile,

        is_deleted: false,

    };

    if (excludeId) {

        where.id = {

            [Op.ne]: excludeId,

        };

    }

    return await Users.findOne({
        where,
    });

};

/**
 * Find Role
 */
// const findRoleById = async (roleId) => {

//     return await AdminRoles.findOne({

//         where: {

//             id: roleId,

//             status: "active",

//             is_deleted: false,

//         },

//     });

// };
const findRoleById = async (roleId) => {

    return await AdminRoles.findOne({
        where: {
            id: roleId,
        },
    });

};
/**
 * Admin User List
 */
const getUsers = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    roleId = "",
    sortBy = "created_at",
    sortOrder = "DESC",
}) => {

    const offset = (page - 1) * limit;

    const where = {

        is_deleted: false,

    };

    if (status) {

        where.status = status;

    }

    if (roleId) {

        where.role_id = roleId;

    }

    if (search) {

        where[Op.or] = [

            {
                name: {
                    [Op.like]: `%${search}%`,
                },
            },

            {
                email: {
                    [Op.like]: `%${search}%`,
                },
            },

            {
                mobile: {
                    [Op.like]: `%${search}%`,
                },
            },

        ];

    }

    return await Users.findAndCountAll({

        where,

        include: [

            {

                model: AdminRoles,

                as: "role",

                attributes: [

                    "id",

                    "name",

                ],

            },
            {
                model: Organisation,
                as: "organisation",
                attributes: [
                    "id",
                    "organisation_code",
                    "organisation_name",
                    "base_currency",
                    "is_active",
                ],
            },

        ],

        offset,

        limit: Number(limit),

        order: [[sortBy, sortOrder]],

    });

};

/**
 * Update Admin User
 */
const updateUser = async (
    id,
    payload
) => {

    await Users.update(payload, {

        where: {
            id,
            is_deleted: false,
        },

    });

    return await findUserById(id);

};

/**
 * Soft Delete
 */
const deleteUser = async (id) => {

    return await Users.update(

        {
            is_deleted: true,
        },

        {
            where: {
                id,
                is_deleted: false,
            },
        }

    );

};

/**
 * Update Status
 */
const updateStatus = async (
    id,
    status
) => {

    await Users.update(

        {
            status,
        },

        {
            where: {
                id,
                is_deleted: false,
            },
        }

    );

    return await findUserById(id);

};

module.exports = {

    createUser,

    findUserById,

    findUserByEmail,

    findUserByMobile,

    findRoleById,

    getUsers,

    updateUser,

    deleteUser,

    updateStatus,

};