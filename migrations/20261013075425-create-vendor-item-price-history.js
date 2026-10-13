'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('vendor_item_price_history', {
            id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            vendor_item_id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'vendor_items',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            effective_from: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },

            effective_to: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },

            currency_code: {
                type: Sequelize.CHAR(3),
                allowNull: false,
                defaultValue: 'GBP',
            },

            price_uom_id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            minimum_qty: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            basic_unit_price: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
            },

            discount_percent: {
                type: Sequelize.DECIMAL(9, 6),
                allowNull: false,
                defaultValue: 0,
            },

            freight_per_unit: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            other_charge_per_unit: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 0,
            },

            net_unit_price: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
            },

            source_type: {
                type: Sequelize.ENUM(
                    'QUOTATION',
                    'CONTRACT',
                    'NEGOTIATION',
                    'MANUAL'
                ),
                allowNull: false,
                defaultValue: 'MANUAL',
            },

            reference_no: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },

            remarks: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex(
            'vendor_item_price_history',
            [
                'vendor_item_id',
                'effective_from',
                'effective_to',
                'minimum_qty',
            ],
            {
                name: 'vendor_item_price_history_lookup_idx',
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('vendor_item_price_history');

        if (queryInterface.sequelize.getDialect() === 'postgres') {
            await queryInterface.sequelize.query(
                'DROP TYPE IF EXISTS "enum_vendor_item_price_history_source_type";'
            );
        }
    },
};