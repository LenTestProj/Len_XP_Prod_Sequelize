'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('admin_permissions', {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            module_name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            permission_key: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            permission_name: {
                type: Sequelize.STRING(100),
                allowNull: false,
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

        await queryInterface.addIndex('admin_permissions', ['module_name']);

        await queryInterface.addIndex('admin_permissions', ['permission_key']);

        await queryInterface.addIndex('admin_permissions', ['permission_name']);

        await queryInterface.addIndex(
            'admin_permissions',
            ['module_name', 'permission_key', 'is_deleted'],
            {
                unique: true,
                name: 'admin_permissions_module_key_deleted_unique',
            }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('admin_permissions');
    },
};