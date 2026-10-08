'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            role_id:{
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model:'admin_roles',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },

            organization_id:{
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'organizations',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
             email: {
                type: Sequelize.STRING(150),
                allowNull: false,
            },

            mobile: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },

            passwordExpiry: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            status: {
                type: Sequelize.ENUM("active", "inactive"),
                allowNull: false,
                defaultValue: "active",
            },

            reset_otp: {
                type: Sequelize.STRING(6),
                allowNull: true,
            },

            reset_otp_expiry: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            created_by: {
                type: Sequelize.BIGINT,
                allowNull: true,
            },

            updated_by: {
                type: Sequelize.BIGINT,
                allowNull: true,
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

        await queryInterface.addIndex('users', ['organization_id'], {
            name: 'idx_users_organization_id'
        });

        await queryInterface.addIndex('users', ['status'], {
            name: 'idx_users_status'
        });

        await queryInterface.addIndex('users', ['is_deleted'], {
            name: 'idx_users_is_deleted'
        });

        await queryInterface.addIndex('users', ['status', 'is_deleted'], {
            name: 'idx_users_status_is_deleted'
        });

        await queryInterface.addIndex('users', [
            'role_id',
            'status',
            'is_deleted'
        ], {
            name: 'idx_users_role_status_deleted'
        });

        await queryInterface.addIndex('users', ['created_by'], {
            name: 'idx_users_created_by'
        });

        await queryInterface.addIndex('users', ['updated_by'], {
            name: 'idx_users_updated_by'
        });
    },

    async down (queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('users');
    }
};
