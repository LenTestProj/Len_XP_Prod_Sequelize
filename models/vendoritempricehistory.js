'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class VendorItemPriceHistory extends Model {
        static associate(models) {
            VendorItemPriceHistory.belongsTo(models.VendorItem, {
                foreignKey: 'vendor_item_id',
                as: 'vendorItem',
            });

            VendorItemPriceHistory.belongsTo(models.Units, {
                foreignKey: 'price_uom_id',
                as: 'priceUom',
            });
        }
    }

    VendorItemPriceHistory.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            vendor_item_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'vendor_items',
                    key: 'id',
                },
            },

            effective_from: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },

            effective_to: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            currency_code: {
                type: DataTypes.CHAR(3),
                allowNull: false,
                defaultValue: 'GBP',
            },

            price_uom_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
            },

            minimum_qty: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            basic_unit_price: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
            },

            discount_percent: {
                type: DataTypes.DECIMAL(9, 6),
                allowNull: false,
                defaultValue: 0,
            },

            freight_per_unit: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            other_charge_per_unit: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            net_unit_price: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
            },

            source_type: {
                type: DataTypes.ENUM(
                    'QUOTATION',
                    'CONTRACT',
                    'NEGOTIATION',
                    'MANUAL'
                ),
                allowNull: false,
                defaultValue: 'MANUAL',
            },

            reference_no: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            remarks: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },

            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'VendorItemPriceHistory',
            tableName: 'vendor_item_price_history',
            timestamps: false,
            underscored: true,

            // Add indexes and validation here if required.
        }
    );

    return VendorItemPriceHistory;
};