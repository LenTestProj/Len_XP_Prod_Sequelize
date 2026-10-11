'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('formulation_versions', {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            formulation_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'formulations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            version_no: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            status: {
                type: Sequelize.ENUM('DRAFT', 'APPROVED', 'OBSOLETE'),
                allowNull: false,
                defaultValue: 'DRAFT',
            },

            effective_from: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },

            effective_to: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },

            standard_output_qty: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
            },

            output_uom_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            expected_process_loss_percent: {
                type: Sequelize.DECIMAL(9, 6),
                allowNull: false,
                defaultValue: 0,
            },

            expected_output_qty: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
            },

            instructions: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            approved_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            approved_by: {
                type: Sequelize.BIGINT,
                allowNull: true,
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex(
            'formulation_versions',
            ['formulation_id'],
            {
                name: 'formulation_versions_formulation_id_idx',
            }
        );

        await queryInterface.addIndex(
            'formulation_versions',
            ['formulation_id', 'version_no'],
            {
                unique: true,
                name: 'formulation_versions_formulation_version_unique',
            }
        );

        await queryInterface.addIndex(
            'formulation_versions',
            ['status'],
            {
                name: 'formulation_versions_status_idx',
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('formulation_versions');

        // PostgreSQL creates a separate enum type for this column.
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_formulation_versions_status";'
        );
    },
};