'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('taxes', {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            hsn_code: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },

            tax_type: {
                type: Sequelize.ENUM(
                'GST',
                'VAT',
                'SERVICE_TAX',
                'EXCISE',
                'CESS',
                'CUSTOM_DUTY',
                'OTHER'
                ),
                allowNull: false,
                defaultValue: 'GST',
            },

            description: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },

            cgst: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.00,
            },

            sgst: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.00,
            },

            igst: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.00,
            },

            total_tax: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.00,
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

        await queryInterface.addIndex('taxes', ['tax_type']);
        await queryInterface.addIndex('taxes', ['status']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('taxes');

        await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_taxes_tax_type";'
        );

        await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_taxes_status";'
        );
    },
};