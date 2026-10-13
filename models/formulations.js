'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Formulations extends Model {
        static associate(models) {
            Formulations.belongsTo(models.Organizations, {
                foreignKey: 'organization_id',
                as: 'organization',
            });

            Formulations.belongsTo(models.Items, {
                foreignKey: 'finished_product_item_id',
                as: 'finishedProduct',
            });

            Formulations.hasMany(models.FormulationVersions, {
                foreignKey: 'formulation_id',
                as: 'versions',
                onDelete: 'CASCADE',
            });
        }
    }

    Formulations.init(
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            organization_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                model: 'organizations',
                key: 'id',
                },
            },

            finished_product_item_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                model: 'items',
                key: 'id',
                },
            },

            formulation_code: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },

            formulation_name: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },

            formulation_type: {
                type: DataTypes.ENUM(
                'MANUFACTURING',
                'REPACKING',
                'ASSEMBLY'
                ),
                allowNull: false,
                defaultValue: 'MANUFACTURING',
            },

            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'Formulations',
            tableName: 'formulations',
            timestamps: true,
            underscored: true,

            indexes: [
                {
                    unique: true,
                    fields: ['organization_id', 'formulation_code'],
                },
                {
                    fields: ['organization_id'],
                },
                {
                    fields: ['finished_product_item_id'],
                },
            ],
        }
    );

    return Formulations;
};