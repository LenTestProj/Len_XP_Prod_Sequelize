const { Op,literal } = require("sequelize");

const { AdminRoles,AdminPermissions,AdminRolePermissions,Users } = require("../models");

/**
 * Create Role
 */
const createRole = async (payload) => {
    return await AdminRoles.create(payload);
};

/**
 * Find Role By Name
 */
const findRoleByName = async (name,excludeId = null) => {
    const where = {
         name: name.trim(),
        is_deleted: false,
    };

    if (excludeId) {
        where.id = {
            [Op.ne]: excludeId,
        };
    }

    return await AdminRoles.findOne({ where });
    
};

/**
 * Find Role By Id
 */
// const findRoleById = async (id) => {
//     return await AdminRoles.findOne({
//         where: {
//             id,
//             is_deleted: false,
//         },
//     });
// };
const findRoleById = async (id) => {

    return await AdminRoles.findOne({

        where: {
            id,
            is_deleted: false,
        },
        attributes: {
            include: [
                [
                    literal(`(
                        SELECT COUNT(*)
                        FROM users AS u
                        WHERE u.role_id = AdminRoles.id
                        AND u.is_deleted = false
                    )`),
                    "userCount",
                ],
            ],
        },
        include: [
            {
                model: AdminPermissions,
                as: "permissions",

                attributes: [
                    "id",
                    "module_name",
                    "permission_key",
                    "permission_name",
                    "is_deleted",
                ],

                through: {
                    attributes: [],
                },

                where: {
                    is_deleted: false,
                },

                required: false,
            },
        ],

    });

};

/**
 * List Roles
 */
// const getRoles = async ({
//     page = 1,
//     limit = 10,
//     search = "",
//     sortBy = "created_at",
//     sortOrder = "DESC",
// }) => {

//     const offset = (page - 1) * limit;

//     const where = {
//         is_deleted: false,
//     };

//     if (search) {
//         where[Op.or] = [
//             {
//                 name: {
//                     [Op.like]: `%${search}%`,
//                 },
//             },
//             {
//                 description: {
//                     [Op.like]: `%${search}%`,
//                 },
//             },
//         ];
//     }

//     return await AdminRoles.findAndCountAll({

//         where,

//         offset,

//         limit: Number(limit),

//         order: [[sortBy, sortOrder]],

//     });

// };
const getRoles = async ({
    page = 1,
    limit = 10,
    search = "",
    sortBy = "created_at",
    sortOrder = "DESC",
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
                description: {
                    [Op.like]: `%${search}%`,
                },
            },

        ];

    }

    const result = await AdminRoles.findAndCountAll({

        where,

        include: [

            // Permissions
            {
                model: AdminPermissions,

                as: "permissions",

                attributes: [
                    "id",
                    "module_name",
                    "permission_key",
                    "permission_name",
                ],

                through: {
                    attributes: [],
                },

                where: {
                    is_deleted: false,
                },

                required: false,
            },

        ],

        distinct: true,

        offset,

        limit: Number(limit),

        order: [
            [sortBy, sortOrder],
        ],

    });

    /*
    |--------------------------------------------------------------------------
    | Add Permission Count + User Count
    |--------------------------------------------------------------------------
    */

    const rows = await Promise.all(

        result.rows.map(async (role) => {

            const roleData = role.toJSON();

            /*
            |----------------------------------------------------------------------
            | Permission Count
            |----------------------------------------------------------------------
            */

            const permissionCount =
                roleData.permissions?.length || 0;


            /*
            |----------------------------------------------------------------------
            | User Count
            | Only active/non-deleted users
            |----------------------------------------------------------------------
            */

            const userCount = await Users.count({

                where: {
                    role_id: role.id,
                    is_deleted: false,
                },

            });


            return {

                ...roleData,

                permissionCount,

                userCount,

            };

        })

    );

    return {

        count: result.count,

        rows,

    };

};
/**
 * Update Role
 */
const updateRole = async (role, payload) => {

    return await role.update(payload);

};

/**
 * Soft Delete
 */
const deleteRole = async (role) => {

    return await role.update({

        is_deleted: true,

    });

};

module.exports = {

    createRole,

    findRoleByName,

    findRoleById,

    getRoles,

    updateRole,

    deleteRole,

};