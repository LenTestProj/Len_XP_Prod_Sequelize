'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AdminRolePermissions extends Model {
        static associate(models) {
            // AdminRolePermissions.belongsTo(models.AdminRoles, {
            //     foreignKey: 'role_id',
            //     as: 'role',
            // });

            // AdminRolePermissions.belongsTo(models.AdminPermissions, {
            //     foreignKey: 'permission_id',
            //     as: 'permission',
            // });
            AdminRolePermissions.belongsTo(models.AdminRoles,{
                foreignKey:'role_id',
                as:'role'
            })
            AdminRolePermissions.belongsTo(models.AdminPermissions, {
                foreignKey: 'permission_id',
                as: 'permission',
            })
        }
    }

    AdminRolePermissions.init(
        {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            role_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'admin_roles',
                    key: 'id',
                },
            },
            permission_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'admin_permissions',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'AdminRolePermissions',
            tableName: 'admin_role_permissions',
            timestamps: true,
            underscored: true,
            indexes: [
                { fields: ['role_id'] },
                { fields: ['permission_id'] },
                {
                    unique: true,
                    fields: ['role_id', 'permission_id'],
                },
            ],
        }
    );

    return AdminRolePermissions;
};;