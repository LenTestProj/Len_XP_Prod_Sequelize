'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('formulations', {
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

            finished_product_item_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                model: 'items',
                key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            formulation_code: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },

            formulation_name: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },

            formulation_type: {
                type: Sequelize.ENUM(
                'MANUFACTURING',
                'REPACKING',
                'ASSEMBLY'
                ),
                allowNull: false,
                defaultValue: 'MANUFACTURING',
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

        await queryInterface.addIndex(
        'formulations',
        ['organization_id', 'formulation_code'],
        {
            unique: true,
            name: 'formulations_org_code_unique',
        }
        );

        await queryInterface.addIndex(
        'formulations',
        ['organization_id'],
        {
            name: 'formulations_organization_id_idx',
        }
        );

        await queryInterface.addIndex(
        'formulations',
        ['finished_product_item_id'],
        {
            name: 'formulations_finished_product_item_id_idx',
        }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('formulations');

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_formulations_formulation_type";'
        );
    },
};