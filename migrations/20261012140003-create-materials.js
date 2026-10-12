'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('materials', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'material_categories',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            name: {
                type: Sequelize.STRING(150),
                allowNull: false,
            },

            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            unit_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            tax_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'taxes',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            minimum_stock: {
                type: Sequelize.DECIMAL(12, 3),
                allowNull: false,
                defaultValue: 0.000,
            },

            reorder_level: {
                type: Sequelize.DECIMAL(12, 3),
                allowNull: false,
                defaultValue: 0.000,
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

        await queryInterface.addIndex('materials', ['category_id'], {
            name: 'materials_category_id_idx',
        });

        await queryInterface.addIndex('materials', ['unit_id'], {
            name: 'materials_unit_id_idx',
        });

        await queryInterface.addIndex('materials', ['tax_id'], {
            name: 'materials_tax_id_idx',
        });

        await queryInterface.addIndex('materials', ['status'], {
            name: 'materials_status_idx',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('materials');

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_materials_status";'
        );
    },
};