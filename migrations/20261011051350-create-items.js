
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('items', {
            id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            organisation_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'organizations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            item_code: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },

            item_name: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },

            item_type: {
                type: Sequelize.ENUM(
                    'RAW_MATERIAL',
                    'PACKAGING_MATERIAL',
                    'FINISHED_PRODUCT'
                ),
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

            tax_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                    model: 'taxes',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },

            batch_tracking_required: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },

            expiry_tracking_required: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            shelf_life_days: {
                type: Sequelize.FLOAT.UNSIGNED,
                allowNull: true,
            },

            inventory_valuation_method: {
                type: Sequelize.ENUM(
                    'FIFO',
                    'FEFO',
                    'WEIGHTED_AVERAGE',
                    'SPECIFIC_LOT'
                ),
                allowNull: false,
                defaultValue: 'FIFO',
            },

            standard_cost: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: true,
            },

            last_purchase_cost: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: true,
            },

            minimum_stock_qty: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            reorder_qty: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            is_purchase_item: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            is_manufactured_item: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            is_sale_item: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
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

        await queryInterface.addIndex(
            'items',
            ['organisation_id', 'item_code'],
            { name: 'items_organisation_item_code_idx' }
        );

        await queryInterface.addIndex(
            'items',
            ['organisation_id', 'item_type', 'is_active'],
            { name: 'items_organisation_type_active_idx' }
        );

        await queryInterface.addIndex(
            'items',
            ['base_uom_id'],
            { name: 'items_base_uom_id_idx' }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('items');
    },
};
