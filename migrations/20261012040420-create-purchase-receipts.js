'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('purchase_receipts', {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            organization_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'organizations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            vendor_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'vendors',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            warehouse_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'warehouses',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            receipt_no: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },

            receipt_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },

            supplier_invoice_no: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },

            supplier_invoice_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },

            currency_code: {
                type: Sequelize.CHAR(3),
                allowNull: false,
                defaultValue: 'GBP',
            },

            status: {
                type: Sequelize.ENUM(
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
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            total_discount_amount: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            total_tax_amount: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

             total_freight_amount: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            total_other_amount: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            total_invoice_amount: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Unique receipt number within each organization
        await queryInterface.addIndex('purchase_receipts', {
            unique: true,
            fields: ['organization_id', 'receipt_no'],
            name: 'purchase_receipts_org_receipt_no_unique',
        });

        await queryInterface.addIndex('purchase_receipts', {
            fields: ['organization_id'],
            name: 'purchase_receipts_organization_id_idx',
        });

        await queryInterface.addIndex('purchase_receipts', {
            fields: ['vendor_id'],
            name: 'purchase_receipts_vendor_id_idx',
        });

        await queryInterface.addIndex('purchase_receipts', {
            fields: ['warehouse_id'],
            name: 'purchase_receipts_warehouse_id_idx',
        });

        await queryInterface.addIndex('purchase_receipts', {
            fields: ['receipt_date'],
            name: 'purchase_receipts_receipt_date_idx',
        });

        await queryInterface.addIndex('purchase_receipts', {
            fields: ['status'],
            name: 'purchase_receipts_status_idx',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('purchase_receipts');

        await queryInterface.dropEnum(
            'enum_purchase_receipts_status'
        );
    },
};