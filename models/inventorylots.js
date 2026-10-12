'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class InventoryLots extends Model {
        static associate(models) {
            InventoryLots.belongsTo(models.Organizations,{
                foreignKey:"organization_id",
                as:"organization"
            });

            InventoryLots.belongsTo(models.Items,{
                foreignKey:"item_id",
                as:"item"
            })
            InventoryLots.belongsTo(models.Units,{
                foreignKey:"base_uom_id",
                as:"baseUom"
            })
            // Add the production-batch association when its model is available.
        }
    }

    InventoryLots.init(
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            organisation_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'organisations',
                    key: 'id',
                },
            },

            item_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'items',
                    key: 'id',
                },
            },

            internal_lot_no: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },

            supplier_batch_no: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            source_type: {
                type: DataTypes.ENUM(
                    'PURCHASE',
                    'PRODUCTION',
                    'OPENING_STOCK',
                    'TRANSFER',
                    'RETURN',
                    'ADJUSTMENT'
                ),
                allowNull: false,
            },

            purchase_receipt_line_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'purchase_receipt_lines',
                    key: 'id',
                },
            },

            source_production_batch_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },

            manufacturing_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            expiry_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            quality_status: {
                type: DataTypes.ENUM(
                    'QUARANTINE',
                    'APPROVED',
                    'REJECTED',
                    'BLOCKED'
                ),
                allowNull: false,
                defaultValue: 'QUARANTINE',
            },

            original_qty: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
            },

            available_qty: {
                type: DataTypes.DECIMAL(18, 6),
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

            currency_code: {
                type: DataTypes.CHAR(3),
                allowNull: false,
                defaultValue: 'GBP',
            },

            inventory_unit_cost: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'InventoryLots',
            tableName: 'inventory_lots',

            timestamps: true,
            underscored: true,
            createdAt: 'created_at',
            updatedAt: false,

            indexes: [
                {
                    unique: true,
                    fields: ['organisation_id', 'internal_lot_no'],
                    name: 'inventory_lots_org_internal_lot_unique',
                },
                {
                    fields: ['item_id', 'manufacturing_date', 'id'],
                    name: 'inventory_lots_item_mfg_id_idx',
                },
                {
                    fields: [
                        'item_id',
                        'expiry_date',
                        'manufacturing_date',
                        'id',
                    ],
                    name: 'inventory_lots_item_exp_mfg_id_idx',
                },
            ],

            validate: {
                quantityCheck() {
                    if (
                        this.original_qty != null &&
                        Number(this.original_qty) < 0
                    ) {
                        throw new Error(
                            'Original quantity cannot be negative.'
                        );
                    }

                    if (
                        this.available_qty != null &&
                        Number(this.available_qty) < 0
                    ) {
                        throw new Error(
                            'Available quantity cannot be negative.'
                        );
                    }
                },
            },
        }
    );

    return InventoryLots;
};