'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AdminRoles.hasMany(models.Users, {
        foreignKey: 'role_id',
        as: 'users',
      });

      AdminRoles.belongsToMany(models.AdminPermissions, {
        through: models.AdminRolePermissions,
        foreignKey: 'role_id',
        otherKey: 'permission_id',
        as: 'permissions',
      });

      AdminRoles.hasMany(models.AdminRolePermissions, {
        foreignKey: 'role_id',
        as: 'rolePermissions',
      });
    }
  }
  AdminRoles.init({
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'AdminRoles',
    tableName: 'admin_roles',
    timestamps: true,
    underscored: true,
  });
  return AdminRoles;
};