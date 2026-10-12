'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ItemUomConversion extends Model {
        static associate(models) {
            ItemUomConversion.belongsTo(models.Items, {
                foreignKey: 'item_id',
                as: 'item',
            });

            ItemUomConversion.belongsTo(models.Units, {
                foreignKey: 'from_uom_id',
                as: 'fromUom',
            });

            ItemUomConversion.belongsTo(models.Units, {
                foreignKey: 'to_uom_id',
                as: 'toUom',
            });
        }
    }

    ItemUomConversion.init(
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            item_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'items',
                    key: 'id',
                },
            },

            from_uom_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
            },

            to_uom_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'units',
                    key: 'id',
                },
            },

            conversion_factor: {
                type: DataTypes.DECIMAL(24, 10),
                allowNull: false,
                validate: {
                    min: 0.0000000001,
                },
            },

            is_purchase_conversion: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            is_production_conversion: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            effective_from: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            effective_to: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                validate: {
                    isAfterOrEqualToEffectiveFrom(value) {
                        if (
                            value &&
                            this.effective_from &&
                            value < this.effective_from
                        ) {
                            throw new Error(
                                'effective_to must be on or after effective_from'
                            );
                        }
                    },
                },
            },
        },
        {
            sequelize,
            modelName: 'ItemUomConversion',
            tableName: 'item_uom_conversions',
            timestamps: false,
            underscored: true,

            indexes: [
                {
                    fields: ['item_id'],
                },
                {
                    fields: ['from_uom_id'],
                },
                {
                    fields: ['to_uom_id'],
                },
            ],
        }
    );

    return ItemUomConversion;
};