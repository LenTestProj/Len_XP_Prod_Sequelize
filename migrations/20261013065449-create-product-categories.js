'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('product_categories', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },

            description: {
                type: Sequelize.TEXT,
                allowNull: true,
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
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('product_categories', ['status'], {
            name: 'product_categories_status_idx',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('product_categories');

        // Required for PostgreSQL when the ENUM type remains after dropping the table.
        if (queryInterface.sequelize.getDialect() === 'postgres') {
            await queryInterface.sequelize.query(
                'DROP TYPE IF EXISTS "enum_product_categories_status";'
            );
        }
    },
};