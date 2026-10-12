'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('warehouses', {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            organization_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                    model: 'organizations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            warehouse_code: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },

            warehouse_name: {
                type: Sequelize.STRING(150),
                allowNull: false,
            },

            warehouse_type: {
                type: Sequelize.ENUM(
                    'RAW_MATERIAL',
                    'PACKAGING',
                    'FINISHED_GOODS',
                    'MIXED',
                    'PRODUCTION'
                ),
                allowNull: false,
                defaultValue: 'MIXED',
            },

            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        });

        await queryInterface.addIndex('warehouses', ['warehouse_code'], {
            name: 'warehouses_warehouse_code_idx',
        });

        await queryInterface.addIndex('warehouses', ['organization_id'], {
            name: 'warehouses_organization_id_idx',
        });

        await queryInterface.addIndex('warehouses', ['warehouse_type'], {
            name: 'warehouses_warehouse_type_idx',
        });

        await queryInterface.addIndex('warehouses', ['is_active'], {
            name: 'warehouses_is_active_idx',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('warehouses');

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_warehouses_warehouse_type";'
        );
    },
};