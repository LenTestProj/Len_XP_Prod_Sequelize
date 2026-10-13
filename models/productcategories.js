'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RawMaterialDetails extends Model {
        static associate(models) {
            RawMaterialDetails.belongsTo(models.Items, {
                foreignKey: 'item_id',
                as: 'item',
            });
        }
    }

    RawMaterialDetails.init(
        {
            item_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'items',
                    key: 'id',
                },
            },

            material_category: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            ingredient_name: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },

            allergen_information: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },

            requires_quality_check: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },

            storage_temperature_min: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: true,
            },

            storage_temperature_max: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: true,
            },

            density_kg_per_litre: {
                type: DataTypes.DECIMAL(18, 8),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'RawMaterialDetails',
            tableName: 'raw_material_details',
            timestamps: false,
        }
    );

    return RawMaterialDetails;
};