'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FinishedProducts extends Model {
        static associate(models) {
            // Define associations here
        }
    }

    FinishedProducts.init({
        item_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'items',
                key: 'id',
            },
        },

        product_category: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },

        net_content_value: {
            type: DataTypes.DECIMAL(18, 6),
            allowNull: true,
        },

        net_content_uom_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'units',
                key: 'id',
            },
        },

        default_batch_output_qty: {
            type: DataTypes.DECIMAL(18, 6),
            allowNull: true,
        },

        sale_pack_size: {
            type: DataTypes.DECIMAL(18, 6),
            allowNull: false,
            defaultValue: 1,
        },

        quality_check_required: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        sequelize,
        modelName: 'FinishedProductDetails',
        tableName: 'finished_product_details',
        timestamps: false,
    });

    return FinishedProducts;
};