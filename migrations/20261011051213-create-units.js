'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('units', {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },

            dimension: {
                type: Sequelize.ENUM(
                'MASS',
                'VOLUME',
                'COUNT',
                'LENGTH',
                'AREA',
                'OTHER'
                ),
                allowNull: false,
            },

            decimal_places: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                defaultValue: 3,
            },

            code: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },

            status: {
                type: Sequelize.ENUM('active', 'inactive'),
                allowNull: false,
                defaultValue: 'active',
            },

            is_deleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        await queryInterface.addIndex('units', ['name']);
        await queryInterface.addIndex('units', ['code']);
        await queryInterface.addIndex('units', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('units');

        // PostgreSQL ENUM types may remain after dropping the table.
        await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_units_dimension";'
        );

        await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_units_status";'
        );
    },
};