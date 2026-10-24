const {
    AdminRoles,
    AdminPermissions,
    AdminRolePermissions,
    sequelize,
} = require("../models");

/**
 * Find Role
 */
const findRole = async (id) => {

    return await AdminRoles.findOne({
        where: {
            id,
            is_deleted: false,
            // status: "active",
        },
    });

};

/**
 * Get Permissions
 */
const getPermissions = async (permissionIds) => {

    return await AdminPermissions.findAll({

        where: {
            id: permissionIds,
            is_deleted: false,
        },

    });

};

/**
 * Delete Existing Role Permissions
 */
const deleteRolePermissions = async (roleId, transaction) => {

    return await AdminRolePermissions.destroy({

        where: {
            role_id: roleId,
        },

        transaction,

    });

};

/**
 * Bulk Assign Permissions
 */

const assignPermissions = async (payload, transaction) => {

    return await AdminRolePermissions.bulkCreate(
        payload,
        {
            transaction,
        }
    );

};

module.exports = {

    sequelize,

    findRole,

    getPermissions,

    deleteRolePermissions,

    assignPermissions,

};