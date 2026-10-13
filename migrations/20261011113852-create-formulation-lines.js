'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('formulation_lines', {
        id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },

        formulation_version_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
            model: 'formulation_versions',
            key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },

        line_no: {
            type: Sequelize.BIGINT,
            allowNull: false,
        },

        component_item_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
            model: 'items',
            key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        },

        required_uom_id: {
            type: Sequelize.BIGINT,
            allowNull: true,
            references: {
            model: 'units',
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
        'formulation_lines',
        ['formulation_version_id', 'line_no'],
        {
            unique: true,
            name: 'formulation_lines_version_line_unique',
        }
        );

        await queryInterface.addIndex(
        'formulation_lines',
        ['component_item_id'],
        {
            name: 'formulation_lines_component_item_idx',
        }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('formulation_lines');
    },
};
