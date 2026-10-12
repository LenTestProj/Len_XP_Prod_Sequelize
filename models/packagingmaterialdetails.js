'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PackagingMaterialDetails extends Model {
        static associate(models) {
            PackagingMaterialDetails.belongsTo(models.Items, {
                foreignKey: 'item_id',
                as: 'item',
            });

            PackagingMaterialDetails.belongsTo(models.Units, {
                foreignKey: 'capacity_uom_id',
                as: 'capacityUom',
            });
        }
    }

    PackagingMaterialDetails.init(
        {
            item_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'items',
                    key: 'id',
                },
            },

            packaging_level: {
                type: DataTypes.ENUM(
                    'PRIMARY',
                    'SECONDARY',
                    'TERTIARY'
                ),
                allowNull: false,
            },

            packaging_type: {
                type: DataTypes.ENUM(
                    'BOTTLE',
                    'CAP',
                    'LABEL',
                    'POUCH',
                    'SACHET',
                    'BOX',
                    'CARTON',
                    'TRAY',
                    'SHRINK_WRAP',
                    'PALLET',
                    'OTHER'
                ),
                allowNull: false,
            },

            capacity_value: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: true,
            },

            capacity_uom_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'units',
                    key: 'id',
                },
            },

            units_per_pack: {
                type: DataTypes.DECIMAL(18, 6),
                allowNull: true,
            },

            reusable: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: 'PackagingMaterialDetails',
            tableName: 'packaging_material_details',
            timestamps: false,
            underscored: true,
        }
    );

    return PackagingMaterialDetails;
};