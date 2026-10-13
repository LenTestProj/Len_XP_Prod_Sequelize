'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Warehouses extends Model {
        static associate(models) {
            Warehouses.belongsTo(models.Organizations, {
                foreignKey: 'organization_id',
                as: 'organization',
            });

            Warehouses.hasMany(models.PurchaseReceipts, {
                foreignKey: 'warehouse_id',
                as: 'purchaseReceipts',
            });
        }
    }

    Warehouses.init(
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            organization_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'organizations',
                    key: 'id',
                },
            },

            warehouse_code: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },

            warehouse_name: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },

            warehouse_type: {
                type: DataTypes.ENUM(
                    'RAW_MATERIAL',
                    'PACKAGING',
                    'FINISHED_GOODS',
                    'MIXED',
                    'PRODUCTION'
                ),
                allowNull: false,
                defaultValue: 'MIXED',
            },

            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'Warehouses',
            tableName: 'warehouses',
            timestamps: false,
            underscored: true,

            indexes: [
                {
                    fields: ['warehouse_code'],
                },
                {
                    fields: ['organization_id'],
                },
                {
                    fields: ['warehouse_type'],
                },
                {
                    fields: ['is_active'],
                },
            ],
        }
    );

    return Warehouses;
};