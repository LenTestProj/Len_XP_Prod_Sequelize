const {
    sequelize,
    findRole,
    getPermissions,
    deleteRolePermissions,
    assignPermissions,
} = require("../services/rolePermission.service");

class RolePermissionController {

    /**
     * Assign Permissions to Role
     *
     * PUT /roles/:id/permissions
     */
    static async assign(req, res) {

        const transaction = await sequelize.transaction();

        try {

            const roleId = Number(req.params.id);

            const permissionIds = [...new Set(req.body.permission_ids)];

            /*
            |--------------------------------------------------------------------------
            | Check Role
            |--------------------------------------------------------------------------
            */

            const role = await findRole(roleId);

            if (!role) {

                await transaction.rollback();

                return res.status(404).json({
                    success: false,
                    message: "Role not found.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Check Permissions
            |--------------------------------------------------------------------------
            */

            const permissions = await getPermissions(permissionIds);

            if (permissions.length !== permissionIds.length) {

                await transaction.rollback();

                return res.status(404).json({
                    success: false,
                    message: "One or more permissions are invalid.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Remove Existing Permissions
            |--------------------------------------------------------------------------
            */

            await deleteRolePermissions(
                roleId,
                transaction
            );

            /*
            |--------------------------------------------------------------------------
            | Prepare Bulk Data
            |--------------------------------------------------------------------------
            */

            const payload = permissionIds.map(permissionId => ({
                role_id: roleId,
                permission_id: permissionId,
            }));

            /*
            |--------------------------------------------------------------------------
            | Assign Permissions
            |--------------------------------------------------------------------------
            */

            await assignPermissions(
                payload,
                transaction
            );

            await transaction.commit();

            return res.status(200).json({

                success: true,

                message:
                    "Permissions assigned successfully.",

            });

        } catch (error) {

            await transaction.rollback();

            console.error(error);

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

}

module.exports = RolePermissionController;