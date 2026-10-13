'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('vendor_items', {
            id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            vendor_id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'vendors',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            item_id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'items',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            vendor_item_code: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },

            vendor_item_name: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },

            purchase_uom_id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            minimum_order_qty: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: true,
            },

            standard_lead_time_days: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: true,
            },

            preferred_vendor: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        });

        await queryInterface.addIndex(
            'vendor_items',
            ['vendor_id', 'item_id'],
            {
                unique: true,
                name: 'vendor_items_vendor_id_item_id_unique',
            }
        );

        await queryInterface.addIndex(
            'vendor_items',
            ['item_id', 'preferred_vendor'],
            {
                name: 'vendor_items_item_preferred_idx',
            }
        );

        await queryInterface.addIndex(
            'vendor_items',
            ['purchase_uom_id'],
            {
                name: 'vendor_items_purchase_uom_idx',
            }
        );

        await queryInterface.addIndex(
            'vendor_items',
            ['is_active'],
            {
                name: 'vendor_items_is_active_idx',
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('vendor_items');
    },
};