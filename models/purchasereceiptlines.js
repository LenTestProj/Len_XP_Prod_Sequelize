'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PurchaseReceiptLines extends Model {
        static associate(models) {
            PurchaseReceiptLines.belongsTo(models.PurchaseReceipts, {
                foreignKey: 'purchase_receipt_id',
                as: 'purchaseReceipt',
            });

            PurchaseReceiptLines.belongsTo(models.Items, {
                foreignKey: 'item_id',
                as: 'item',
            });

            PurchaseReceiptLines.belongsTo(models.Units, {
                foreignKey: 'purchase_uom_id',
                as: 'purchaseUom',
            });

            PurchaseReceiptLines.belongsTo(models.Units, {
                foreignKey: 'base_uom_id',
                as: 'baseUom',
            });

            PurchaseReceiptLines.hasMany(models.InventoryLots, {
                foreignKey: 'purchase_receipt_line_id',
                as: 'inventoryLots',
            });
        }
    }

    PurchaseReceiptLines.init(
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            purchase_receipt_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'purchase_receipts',
                    key: 'id',
                },
            },

            line_no: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            item_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'items',
                    key: 'id',
                },
            },

            supplier_batch_no: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            internal_lot_no: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },

            manufacturing_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            expiry_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            received_qty: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
            },

            accepted_qty: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            rejected_qty: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            purchase_uom_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
            },

            base_uom_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
            },

            conversion_factor: {
                type: DataTypes.DECIMAL(24, 10),
                allowNull: false,
                defaultValue: 1,
            },

            accepted_base_qty: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            basic_unit_price: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
            },

            discount_amount: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            tax_amount: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            freight_amount: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            other_charge_amount: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            line_net_amount: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
            },

            inventory_unit_cost: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
            },

            quality_status: {
                type: DataTypes.ENUM(
                    'PENDING',
                    'APPROVED',
                    'REJECTED',
                    'PARTIALLY_APPROVED'
                ),
                allowNull: false,
                defaultValue: 'PENDING',
            },
        },
        {
            sequelize,
            modelName: 'PurchaseReceiptLines',
            tableName: 'purchase_receipt_lines',

            timestamps: false,
            underscored: true,

            indexes: [
                {
                    unique: true,
                    fields: ['purchase_receipt_id', 'line_no'],
                },
                {
                    unique: true,
                    fields: ['internal_lot_no'],
                },
                {
                    fields: [
                        'item_id',
                        'expiry_date',
                        'manufacturing_date',
                    ],
                },
            ],

            validate: {
                quantityCheck() {
                    if (
                        this.received_qty != null &&
                        Number(this.received_qty) <= 0
                    ) {
                        throw new Error(
                            'Received quantity must be greater than 0.'
                        );
                    }

                    if (
                        this.accepted_qty != null &&
                        Number(this.accepted_qty) < 0
                    ) {
                        throw new Error(
                            'Accepted quantity cannot be negative.'
                        );
                    }

                    if (
                        this.rejected_qty != null &&
                        Number(this.rejected_qty) < 0
                    ) {
                        throw new Error(
                            'Rejected quantity cannot be negative.'
                        );
                    }

                    if (
                        this.received_qty != null &&
                        this.accepted_qty != null &&
                        this.rejected_qty != null &&
                        Number(this.accepted_qty) +
                            Number(this.rejected_qty) >
                            Number(this.received_qty)
                    ) {
                        throw new Error(
                            'Accepted quantity plus rejected quantity cannot exceed received quantity.'
                        );
                    }
                },
            },
        }
    );

    return PurchaseReceiptLines;
};