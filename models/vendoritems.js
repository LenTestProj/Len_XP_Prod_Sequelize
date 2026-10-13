'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class VendorItem extends Model {
        static associate(models) {
            VendorItem.belongsTo(models.Vendors, {
                foreignKey: 'vendor_id',
                as: 'vendor',
            });

            VendorItem.belongsTo(models.Items, {
                foreignKey: 'item_id',
                as: 'item',
            });

            VendorItem.belongsTo(models.Units, {
                foreignKey: 'purchase_uom_id',
                as: 'purchaseUom',
            });
        }
    }

    VendorItem.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            vendor_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'vendors',
                    key: 'id',
                },
            },

            item_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'items',
                    key: 'id',
                },
            },

            vendor_item_code: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            vendor_item_name: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },

            purchase_uom_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
            },

            minimum_order_qty: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: true,
            },

            standard_lead_time_days: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },

            preferred_vendor: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'VendorItem',
            tableName: 'vendor_items',
            timestamps: false,
            underscored: true,

            indexes: [
                {
                    unique: true,
                    fields: ['vendor_id', 'item_id'],
                },
                {
                    fields: ['item_id', 'preferred_vendor'],
                },
                {
                    fields: ['purchase_uom_id'],
                },
                {
                    fields: ['is_active'],
                },
            ],
        }
    );

    return VendorItem;
};