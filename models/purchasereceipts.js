'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PurchaseReceipts extends Model {
        static associate(models) {
            PurchaseReceipts.belongsTo(models.Organizations, {
                foreignKey: 'organization_id',
                as: 'organization',
            });

            PurchaseReceipts.belongsTo(models.Vendors, {
                foreignKey: 'vendor_id',
                as: 'vendor',
            });

            PurchaseReceipts.belongsTo(models.Warehouses, {
                foreignKey: 'warehouse_id',
                as: 'warehouse',
            });

            PurchaseReceipts.hasMany(models.PurchaseReceiptLines, {
                foreignKey: 'purchase_receipt_id',
                as: 'lines',
                onDelete: 'CASCADE',
            });
        }
    }

    PurchaseReceipts.init(
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            organization_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'organizations',
                    key: 'id',
                },
            },

            vendor_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'vendors',
                    key: 'id',
                },
            },

            warehouse_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'warehouses',
                    key: 'id',
                },
            },

            receipt_no: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },

            receipt_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },

            supplier_invoice_no: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            supplier_invoice_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            currency_code: {
                type: DataTypes.CHAR(3),
                allowNull: false,
                defaultValue: 'GBP',
            },

            status: {
                type: DataTypes.ENUM(
                    'DRAFT',
                    'RECEIVED',
                    'QC_PENDING',
                    'COMPLETED',
                    'CANCELLED'
                ),
                allowNull: false,
                defaultValue: 'DRAFT',
            },

            total_basic_amount: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            total_discount_amount: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            total_tax_amount: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            total_freight_amount: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            total_other_amount: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            total_invoice_amount: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'PurchaseReceipts',
            tableName: 'purchase_receipts',

            timestamps: true,
            underscored: true,

            indexes: [
                {
                    unique: true,
                    fields: ['organization_id', 'receipt_no'],
                },
                {
                    fields: ['organization_id'],
                },
                {
                    fields: ['vendor_id'],
                },
                {
                    fields: ['warehouse_id'],
                },
                {
                    fields: ['receipt_date'],
                },
                {
                    fields: ['status'],
                },
            ],
        }
    );

    return PurchaseReceipts;
};