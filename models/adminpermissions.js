'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminPermissions extends Model {
    static associate(models) {
      AdminPermissions.belongsToMany(models.AdminRoles, {
        through: models.AdminRolePermissions,
        foreignKey: 'permission_id',
        otherKey: 'role_id',
        as: 'roles',
      });

      AdminPermissions.hasMany(models.AdminRolePermissions, {
        foreignKey: 'permission_id',
        as: 'rolePermissions',
      });
    }
  }

  AdminPermissions.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      module_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      permission_key: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      permission_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'AdminPermissions',
      tableName: 'admin_permissions',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['module_name'] },
        { fields: ['permission_key'] },
        { fields: ['permission_name'] },
        {
          unique: true,
          fields: ['module_name', 'permission_key', 'is_deleted'],
        },
      ],
    }
  );

  return AdminPermissions;
};