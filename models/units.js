'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Units extends Model {
        static associate(models) {
        // Define associations here
        }
    }

    Units.init(
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },

            dimension: {
                type: DataTypes.ENUM(
                'MASS',
                'VOLUME',
                'COUNT',
                'LENGTH',
                'AREA',
                'OTHER'
                ),
                allowNull: false,
            },

            decimal_places: {
                type: DataTypes.SMALLINT,
                allowNull: false,
                defaultValue: 3,
            },

            code: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },

            status: {
                type: DataTypes.ENUM('active', 'inactive'),
                allowNull: false,
                defaultValue: 'active',
            },

            is_deleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
        sequelize,
        modelName: 'Units',
        tableName: 'units',
        timestamps: true,
        underscored: true,

        indexes: [
            { fields: ['name'] },
            { fields: ['code'] },
            { fields: ['status'] },
        ],
        }
    );

    return Units;
};