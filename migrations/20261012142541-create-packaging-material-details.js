'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('packaging_material_details', {
            item_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'items',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            packaging_level: {
                type: Sequelize.ENUM(
                    'PRIMARY',
                    'SECONDARY',
                    'TERTIARY'
                ),
                allowNull: false,
            },

            packaging_type: {
                type: Sequelize.ENUM(
                    'BOTTLE',
                    'CAP',
                    'LABEL',
                    'POUCH',
                    'SACHET',
                    'BOX',
                    'CARTON',
                    'TRAY',
                    'SHRINK_WRAP',
                    'PALLET',
                    'OTHER'
                ),
                allowNull: false,
            },

            capacity_value: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: true,
            },

            capacity_uom_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                    model: 'units',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },

            units_per_pack: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: true,
            },

            reusable: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('packaging_material_details');

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_packaging_material_details_packaging_type";'
        );

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_packaging_material_details_packaging_level";'
        );
    },
};