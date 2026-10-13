'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class WarehouseLocations extends Model {
        static associate(models) {
            WarehouseLocations.belongsTo(models.Warehouses, {
                foreignKey: 'warehouse_id',
                as: 'warehouse',
            });
        }
    }

    WarehouseLocations.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            warehouse_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'warehouses',
                    key: 'id',
                },
            },

            location_code: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },

            location_name: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },

            location_type: {
                type: DataTypes.ENUM(
                    'RECEIVING',
                    'QUARANTINE',
                    'AVAILABLE',
                    'REJECTED',
                    'PRODUCTION',
                    'DISPATCH'
                ),
                allowNull: false,
                defaultValue: 'AVAILABLE',
            },

            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'WarehouseLocations',
            tableName: 'warehouse_locations',
            timestamps: false,
            underscored: true,

            indexes: [
                { fields: ['warehouse_id'] },
                { fields: ['location_code'] },
                { fields: ['location_type'] },
                { fields: ['is_active'] },
            ],
        }
    );

    return WarehouseLocations;
};