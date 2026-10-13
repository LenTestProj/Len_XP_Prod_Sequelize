'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('purchase_receipt_lines', {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            purchase_receipt_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'purchase_receipts',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            line_no: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            item_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'items',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            supplier_batch_no: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },

            internal_lot_no: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },

            manufacturing_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },

            expiry_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },

            received_qty: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
            },

            accepted_qty: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            rejected_qty: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            purchase_uom_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            base_uom_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            conversion_factor: {
                type: Sequelize.DECIMAL(24, 10),
                allowNull: false,
                defaultValue: 1,
            },

            accepted_base_qty: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            basic_unit_price: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
            },

            discount_amount: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            tax_amount: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            freight_amount: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            other_charge_amount: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            line_net_amount: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
            },

            inventory_unit_cost: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
            },

            quality_status: {
                type: Sequelize.ENUM(
                    'PENDING',
                    'APPROVED',
                    'REJECTED',
                    'PARTIALLY_APPROVED'
                ),
                allowNull: false,
                defaultValue: 'PENDING',
            },
        });

        // Unique line number within each purchase receipt
        await queryInterface.addIndex('purchase_receipt_lines', {
            unique: true,
            fields: ['purchase_receipt_id', 'line_no'],
            name: 'purchase_receipt_lines_receipt_line_unique',
        });

        // Each internal lot number must be unique
        await queryInterface.addIndex('purchase_receipt_lines', {
            unique: true,
            fields: ['internal_lot_no'],
            name: 'purchase_receipt_lines_internal_lot_unique',
        });

        // Supports item and date-based lot lookups
        await queryInterface.addIndex('purchase_receipt_lines', {
            fields: [
                'item_id',
                'expiry_date',
                'manufacturing_date',
            ],
            name: 'purchase_receipt_lines_item_exp_mfg_idx',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('purchase_receipt_lines');

        // Remove the PostgreSQL ENUM type created for this table
        await queryInterface.dropEnum(
            'enum_purchase_receipt_lines_quality_status'
        );
    },
};