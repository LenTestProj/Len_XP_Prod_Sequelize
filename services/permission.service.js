const { Op } = require("sequelize");

const { AdminPermissions,AdminRolePermissions } = require("../models");

/**
 * Create Permission
 */
const createPermission = async (payload) => {
    return await AdminPermissions.create(payload);
};

/**
 * Find Permission By ID
 */
const findPermissionById = async (id) => {
    return await AdminPermissions.findOne({
        where: {
            id,
            is_deleted: false,
        },
    });
};

/**
 * Find Permission By Module & Key
 */
// const findPermission = async (
//     module_name,
//     permission_key,
//     excludeId = null
// ) => {

//     const where = {
//         module_name,
//         permission_key,
//         is_deleted: false,
//     };

//     if (excludeId) {
//         where.id = {
//             [Op.ne]: excludeId,
//         };
//     }

//     return await AdminPermissions.findOne({
//         where,
//     });

// };
const findPermission = async ({
    module_name,
    permission_key,
    excludeId = null,
}) => {

    const where = {

        module_name,

        permission_key,

        is_deleted: false,

    };

    if (excludeId) {

        where.id = {
            [Op.ne]: excludeId,
        };

    }

    return await AdminPermissions.findOne({

        where,

    });

};
/**
 * Permission List
 */
const getPermissions = async ({
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
                module_name: {
                    [Op.like]: `%${search}%`,
                },
            },

            {
                permission_name: {
                    [Op.like]: `%${search}%`,
                },
            },

            {
                permission_key: {
                    [Op.like]: `%${search}%`,
                },
            },

        ];

    }

    return await AdminPermissions.findAndCountAll({

        where,

        offset,

        limit: Number(limit),

        order: [[sortBy, sortOrder]],

    });

};
const isPermissionAssigned = async (permissionId) => {
    return await AdminRolePermissions.findOne({
        where: {
            permission_id: permissionId,
        },
    });
};
/**
 * Update Permission
 */
const updatePermission = async (permission, payload) => {

    return await permission.update(payload);

};

/**
 * Delete Permission
 */
const deletePermission = async (permission) => {

    return await permission.update({

        is_deleted: true,

    });

};

module.exports = {

    createPermission,

    findPermissionById,

    findPermission,

    getPermissions,

    updatePermission,

    deletePermission,
    isPermissionAssigned,

};