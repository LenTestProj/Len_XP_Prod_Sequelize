'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Units extends Model {
        static associate(models) {
            Units.hasMany(models.Items, {
                foreignKey: 'base_uom_id',
                as: 'items',
            });

            Units.hasMany(models.FinishedProductDetails, {
                foreignKey: 'net_content_uom_id',
                as: 'finishedProductDetails',
            });

            Units.hasMany(models.PackagingMaterialDetails, {
                foreignKey: 'capacity_uom_id',
                as: 'packagingMaterials',
            });

            Units.hasMany(models.FormulationVersions, {
                foreignKey: 'output_uom_id',
                as: 'formulationVersions',
            });

            Units.hasMany(models.FormulationLines, {
                foreignKey: 'required_uom_id',
                as: 'formulationLinesByUom',
            });

            Units.hasMany(models.PurchaseReceiptLines, {
                foreignKey: 'purchase_uom_id',
                as: 'purchaseReceiptLinesByPurchaseUom',
            });

            Units.hasMany(models.PurchaseReceiptLines, {
                foreignKey: 'base_uom_id',
                as: 'purchaseReceiptLinesByBaseUom',
            });

            Units.hasMany(models.ItemUomConversion, {
                foreignKey: 'from_uom_id',
                as: 'fromUomConversions',
            });

            Units.hasMany(models.ItemUomConversion, {
                foreignKey: 'to_uom_id',
                as: 'toUomConversions',
            });

            Units.hasMany(models.InventoryLots, {
                foreignKey: 'base_uom_id',
                as: 'inventoryLots',
            });

            Units.hasMany(models.Materials, {
                foreignKey: 'unitId',
                as: 'materials',
            });
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