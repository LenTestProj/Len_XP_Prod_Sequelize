'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('raw_material_details', {
            item_id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'items',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            material_category: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },

            ingredient_name: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },

            allergen_information: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },

            requires_quality_check: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },

            storage_temperature_min: {
                type: Sequelize.DECIMAL(8, 2),
                allowNull: true,
            },

            storage_temperature_max: {
                type: Sequelize.DECIMAL(8, 2),
                allowNull: true,
            },

            density_kg_per_litre: {
                type: Sequelize.DECIMAL(18, 8),
                allowNull: true,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('raw_material_details');
    },
};