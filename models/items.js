
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Items extends Model {
        static associate(models) {
            Items.belongsTo(models.Organisations, {
                foreignKey: 'organisation_id',
                as: 'organisation',
            });

            Items.belongsTo(models.Units, {
                foreignKey: 'base_uom_id',
                as: 'baseUnit',
            });

            Items.belongsTo(models.Taxes, {
                foreignKey: 'tax_id',
                as: 'tax',
            });
        }
    }

    Items.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            organisation_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'organisations',
                    key: 'id',
                },
            },

            item_code: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },

            item_name: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },

            item_type: {
                type: DataTypes.ENUM(
                    'RAW_MATERIAL',
                    'PACKAGING_MATERIAL',
                    'FINISHED_PRODUCT'
                ),
                allowNull: false,
            },

            base_uom_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
            },

            tax_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
                references: {
                    model: 'taxes',
                    key: 'id',
                },
            },

            batch_tracking_required: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },

            expiry_tracking_required: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            shelf_life_days: {
                type: DataTypes.FLOAT.UNSIGNED,
                allowNull: true,
            },

            inventory_valuation_method: {
                type: DataTypes.ENUM(
                    'FIFO',
                    'FEFO',
                    'WEIGHTED_AVERAGE',
                    'SPECIFIC_LOT'
                ),
                defaultValue: 'FIFO',
            },

            standard_cost: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: true,
            },

            last_purchase_cost: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: true,
            },

            minimum_stock_qty: {
                type: DataTypes.DECIMAL(18, 6),
                defaultValue: 0,
            },

            reorder_qty: {
                type: DataTypes.DECIMAL(18, 6),
                defaultValue: 0,
            },

            is_purchase_item: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            is_manufactured_item: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            is_sale_item: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'Items',
            tableName: 'items',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',

            indexes: [
                {
                    fields: ['organisation_id', 'item_code'],
                },
                {
                    fields: [
                        'organisation_id',
                        'item_type',
                        'is_active',
                    ],
                },
                {
                    fields: ['base_uom_id'],
                },
            ],
        }
    );

    return Items;
};
