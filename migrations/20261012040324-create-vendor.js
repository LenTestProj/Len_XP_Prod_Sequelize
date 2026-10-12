'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('vendors', {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            organization_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'organizations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            vendor_code: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },

            vendor_name: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },

            tax_registration_no: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },

            payment_terms_days: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },

            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
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

        await queryInterface.addIndex('vendors', {
            unique: true,
            fields: ['organization_id', 'vendor_code'],
            name: 'vendors_org_vendor_code_unique',
        });

        await queryInterface.addIndex('vendors', {
            fields: ['vendor_name'],
            name: 'vendors_vendor_name_idx',
        });

        await queryInterface.addIndex('vendors', {
            fields: ['is_active'],
            name: 'vendors_is_active_idx',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('vendors');
    },
};