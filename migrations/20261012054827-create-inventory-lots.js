'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('inventory_lots', {
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

            internal_lot_no: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },

            supplier_batch_no: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },

            source_type: {
                type: Sequelize.ENUM(
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
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                    model: 'purchase_receipt_lines',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },

            source_production_batch_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
            },

            manufacturing_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },

            expiry_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },

            quality_status: {
                type: Sequelize.ENUM(
                    'QUARANTINE',
                    'APPROVED',
                    'REJECTED',
                    'BLOCKED'
                ),
                allowNull: false,
                defaultValue: 'QUARANTINE',
            },

            original_qty: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
            },

            available_qty: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
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

            currency_code: {
                type: Sequelize.CHAR(3),
                allowNull: false,
                defaultValue: 'GBP',
            },

            inventory_unit_cost: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Unique internal lot number per organization
        await queryInterface.addIndex('inventory_lots', {
            unique: true,
            fields: ['organization_id', 'internal_lot_no'],
            name: 'inventory_lots_org_internal_lot_unique',
        });

        // Index for item and manufacturing date
        await queryInterface.addIndex('inventory_lots', {
            fields: ['item_id', 'manufacturing_date', 'id'],
            name: 'inventory_lots_item_mfg_id_idx',
        });

        // Index for item, expiry date and manufacturing date
        await queryInterface.addIndex('inventory_lots', {
            fields: [
                'item_id',
                'expiry_date',
                'manufacturing_date',
                'id',
            ],
            name: 'inventory_lots_item_exp_mfg_id_idx',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('inventory_lots');

        // Remove PostgreSQL ENUM types created for this table
        await queryInterface.dropEnum('enum_inventory_lots_source_type');
        await queryInterface.dropEnum('enum_inventory_lots_quality_status');
    },
};