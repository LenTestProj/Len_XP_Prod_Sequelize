'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FormulationLines extends Model {
        static associate(models) {
            FormulationLines.belongsTo(models.FormulationVersions, {
                foreignKey: 'formulation_version_id',
                as: 'formulationVersion',
            });

            FormulationLines.belongsTo(models.Items, {
                foreignKey: 'component_item_id',
                as: 'componentItem',
            });
        }
    }

    FormulationLines.init(
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            formulation_version_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },

            line_no: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },

            component_item_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'FormulationLines',
            tableName: 'formulation_lines',
            timestamps: true,
            underscored: true,

            indexes: [
                {
                    unique: true,
                    fields: ['formulation_version_id', 'line_no'],
                },
                {
                    fields: ['component_item_id'],
                },
            ],
        }
    );

    return FormulationLines;
};