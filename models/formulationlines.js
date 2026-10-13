'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FormulationLines extends Model {
        static associate(models) {
            FormulationLines.belongsTo(models.FormulationVersions, {
                foreignKey: 'formulation_version_id',
                as: 'version',
            });

            FormulationLines.belongsTo(models.Items, {
                foreignKey: 'component_item_id',
                as: 'componentItem',
            });

            FormulationLines.belongsTo(models.Units, {
                foreignKey: 'required_uom_id',
                as: 'requiredUom',
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

            required_uom_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'units',
                    key: 'id',
                },
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