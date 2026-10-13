'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('warehouse_locations', {
            id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            warehouse_id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'warehouses',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            location_code: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },

            location_name: {
                type: Sequelize.STRING(150),
                allowNull: true,
            },

            location_type: {
                type: Sequelize.ENUM(
                    'RECEIVING',
                    'QUARANTINE',
                    'AVAILABLE',
                    'REJECTED',
                    'PRODUCTION',
                    'DISPATCH'
                ),
                allowNull: false,
                defaultValue: 'AVAILABLE',
            },

            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        });

        await queryInterface.addIndex(
            'warehouse_locations',
            ['warehouse_id'],
            { name: 'warehouse_locations_warehouse_id_idx' }
        );

        await queryInterface.addIndex(
            'warehouse_locations',
            ['location_code'],
            { name: 'warehouse_locations_location_code_idx' }
        );

        await queryInterface.addIndex(
            'warehouse_locations',
            ['location_type'],
            { name: 'warehouse_locations_location_type_idx' }
        );

        await queryInterface.addIndex(
            'warehouse_locations',
            ['is_active'],
            { name: 'warehouse_locations_is_active_idx' }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('warehouse_locations');
    },
};