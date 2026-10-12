'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('item_uom_conversions', {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
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

            from_uom_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            to_uom_id: {
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
            },

            is_purchase_conversion: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            is_production_conversion: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            effective_from: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },

            effective_to: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
        });

        await queryInterface.addIndex(
            'item_uom_conversions',
            ['item_id'],
            { name: 'item_uom_conversions_item_id_idx' }
        );

        await queryInterface.addIndex(
            'item_uom_conversions',
            ['from_uom_id'],
            { name: 'item_uom_conversions_from_uom_id_idx' }
        );

        await queryInterface.addIndex(
            'item_uom_conversions',
            ['to_uom_id'],
            { name: 'item_uom_conversions_to_uom_id_idx' }
        );

        // Ensure conversion_factor is strictly positive.
        await queryInterface.addConstraint('item_uom_conversions', {
            fields: ['conversion_factor'],
            type: 'check',
            where: {
                conversion_factor: {
                    [Sequelize.Op.gt]: 0,
                },
            },
            name: 'item_uom_conversions_factor_positive_chk',
        });

        // effective_to must not precede effective_from.
        await queryInterface.addConstraint('item_uom_conversions', {
            fields: ['effective_from', 'effective_to'],
            type: 'check',
            where: Sequelize.literal(
                'effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from'
            ),
            name: 'item_uom_conversions_effective_dates_chk',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('item_uom_conversions');
    },
};