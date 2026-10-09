
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('admin_role_permissions', {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            role_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'admin_roles',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            permission_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'admin_permissions',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
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

        await queryInterface.addIndex(
            'admin_role_permissions',
            ['role_id'],
            {
                name: 'admin_role_permissions_role_id_idx',
            }
        );

        await queryInterface.addIndex(
            'admin_role_permissions',
            ['permission_id'],
            {
                name: 'admin_role_permissions_permission_id_idx',
            }
        );

        await queryInterface.addIndex(
            'admin_role_permissions',
            ['role_id', 'permission_id'],
            {
                unique: true,
                name: 'admin_role_permissions_role_permission_unique',
            }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('admin_role_permissions');
    },
};
