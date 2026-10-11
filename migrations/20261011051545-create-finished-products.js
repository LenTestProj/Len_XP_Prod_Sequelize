
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('finished_product_details', {
            item_id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'items',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            product_category: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },

            net_content_value: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: true,
            },

            net_content_uom_id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: true,
                references: {
                    model: 'units',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },

            default_batch_output_qty: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: true,
            },

            sale_pack_size: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false,
                defaultValue: 1,
            },

            quality_check_required: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('finished_product_details');
    },
};
