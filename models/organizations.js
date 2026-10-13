'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Organizations extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Organizations.hasMany(models.Items, {
                foreignKey: 'organization_id',
                as: 'items',
            });

            Organizations.hasMany(models.Users, {
                foreignKey: 'organization_id',
                as: 'users',
            });

            Organizations.hasMany(models.Formulations, {
                foreignKey: 'organization_id',
                as: 'formulations',
            });

            Organizations.hasMany(models.PurchaseReceipts, {
                foreignKey: 'organization_id',
                as: 'purchaseReceipts',
            });

            Organizations.hasMany(models.InventoryLots, {
                foreignKey: 'organization_id',
                as: 'inventoryLots',
            });

            Organizations.hasMany(models.Vendors, {
                foreignKey: 'organization_id',
                as: 'vendors',
            });

            Organizations.hasMany(models.Warehouses, {
                foreignKey: 'organization_id',
                as: 'warehouses',
            });
        }
    }
    Organizations.init({
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },

        organisation_code: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },

        organisation_name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        base_currency: {
            type: DataTypes.CHAR(3),
            allowNull: false,
            defaultValue: "GBP",
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        sequelize,
        modelName: 'Organizations',
        tableName: 'organizations',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["organisation_code"],
            },
            {
                fields: ["organisation_name"],
            },
            {
                fields: ["is_active"],
            },
        ],
    });
    return Organizations;
};