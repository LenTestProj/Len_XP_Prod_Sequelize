'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FormulationVersions extends Model {
        static associate(models) {
        FormulationVersions.belongsTo(models.Formulations, {
            foreignKey: 'formulation_id',
            as: 'formulation',
        });

        FormulationVersions.belongsTo(models.Units, {
            foreignKey: 'output_uom_id',
            as: 'outputUom',
        });

        FormulationVersions.belongsTo(models.Users, {
            foreignKey: 'approved_by',
            as: 'approver',
        });

        FormulationVersions.hasMany(models.FormulationLines, {
            foreignKey: 'formulation_version_id',
            as: 'lines',
            onDelete: 'CASCADE',
        });
        }
    }

    FormulationVersions.init(
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            formulation_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'formulations',
                    key: 'id',
                },
            },

            version_no: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            status: {
                type: DataTypes.ENUM('DRAFT', 'APPROVED', 'OBSOLETE'),
                allowNull: false,
                defaultValue: 'DRAFT',
            },

            effective_from: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            effective_to: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            standard_output_qty: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
            },

            output_uom_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
            },

            expected_process_loss_percent: {
                type: DataTypes.DECIMAL(9, 6),
                allowNull: false,
                defaultValue: 0,
            },

            expected_output_qty: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: false,
            },

            instructions: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            approved_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            approved_by: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },

            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'FormulationVersions',
            tableName: 'formulation_versions',
            timestamps: false,

            indexes: [
                {
                    fields: ['formulation_id'],
                },
                {
                    unique: true,
                    fields: ['formulation_id', 'version_no'],
                },
                {
                    fields: ['status'],
                },
            ],
        }
    );

    return FormulationVersions;
};