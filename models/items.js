
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Items extends Model {
        static associate(models) {
            Items.belongsTo(models.Organizations, {
                foreignKey: 'organization_id',
                as: 'organization',
            });

            Items.belongsTo(models.Units, {
                foreignKey: 'base_uom_id',
                as: 'baseUom',
            });

            Items.belongsTo(models.Taxes, {
                foreignKey: 'tax_id',
                as: 'tax',
            });

            Items.hasOne(models.PackagingMaterialDetails, {
                foreignKey: 'item_id',
                as: 'packagingMaterialDetails',
            });

            Items.hasOne(models.FinishedProductDetails, {
                foreignKey: 'item_id',
                as: 'finishedProductDetails',
            });

            Items.hasMany(models.ItemUomConversion, {
                foreignKey: 'item_id',
                as: 'uomConversions',
            });

            Items.hasMany(models.Formulations, {
                foreignKey: 'finished_product_item_id',
                as: 'formulations',
            });

            Items.hasMany(models.FormulationLines, {
                foreignKey: 'component_item_id',
                as: 'formulationLines',
            });

            Items.hasMany(models.PurchaseReceiptLines, {
                foreignKey: 'item_id',
                as: 'purchaseReceiptLines',
            });

            Items.hasMany(models.InventoryLots, {
                foreignKey: 'item_id',
                as: 'inventoryLots',
            });
        }
    }

    Items.init(
        {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            organization_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'organizations',
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
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
            },

            tax_id: {
                type: DataTypes.BIGINT,
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
                type: DataTypes.FLOAT,
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
                    fields: ['organization_id', 'item_code'],
                },
                {
                    fields: [
                        'organization_id',
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
