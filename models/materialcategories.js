'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MaterialCategories extends Model {
        static associate(models) {
            MaterialCategories.hasMany(models.Materials, {
                foreignKey: 'categoryId',
                as: 'materials',
            });
        }
    }

    MaterialCategories.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },

            description: {
                type: DataTypes.TEXT,
                allowNull: true,
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
            modelName: 'MaterialCategories',
            tableName: 'material_categories',
            timestamps: true,
            underscored: true,

            indexes: [
                {
                    unique: true,
                    fields: ['name'],
                },
                {
                    fields: ['status'],
                },
            ],
        }
    );

    return MaterialCategories;
};