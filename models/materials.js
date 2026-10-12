'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Materials extends Model {
        static associate(models) {
            Materials.belongsTo(models.MaterialCategories, {
                foreignKey: 'categoryId',
                as: 'category',
            });

            Materials.belongsTo(models.Units, {
                foreignKey: 'unitId',
                as: 'unit',
            });

            Materials.belongsTo(models.Taxes, {
                foreignKey: 'taxId',
                as: 'tax',
            });
        }
    }

    Materials.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'category_id',
                references: {
                    model: 'material_categories',
                    key: 'id',
                },
            },

            name: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },

            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            unitId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'unit_id',
                references: {
                    model: 'units',
                    key: 'id',
                },
            },

            taxId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'tax_id',
                references: {
                    model: 'taxes',
                    key: 'id',
                },
            },

            minimumStock: {
                type: DataTypes.DECIMAL(12, 3),
                allowNull: false,
                defaultValue: 0.000,
                field: 'minimum_stock',
            },

            reorderLevel: {
                type: DataTypes.DECIMAL(12, 3),
                allowNull: false,
                defaultValue: 0.000,
                field: 'reorder_level',
            },

            status: {
                type: DataTypes.ENUM('active', 'inactive'),
                allowNull: false,
                defaultValue: 'active',
            },

            isDeleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_deleted',
            },
        },
        {
            sequelize,
            modelName: 'Materials',
            tableName: 'materials',
            timestamps: true,
            underscored: true,

            indexes: [
                { fields: ['category_id'] },
                { fields: ['unit_id'] },
                { fields: ['tax_id'] },
                { fields: ['status'] },
            ],
        }
    );

    return Materials;
};