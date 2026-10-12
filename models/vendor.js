'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Vendor extends Model {
        static associate(models) {
            Vendor.belongsTo(models.Organizations, {
                foreignKey: 'organiation_id',
                as: 'organization',
            });

            Vendor.hasMany(models.PurchaseReceipts, {
                foreignKey: 'vendor_id',
                as: 'purchaseReceipts',
            });
        }
    }

    Vendor.init(
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            organization_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'organizations',
                    key: 'id',
                },
            },

            vendor_code: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },

            vendor_name: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },

            tax_registration_no: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            payment_terms_days: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'Vendor',
            tableName: 'vendors',

            timestamps: true,
            underscored: true,

            indexes: [
                {
                    unique: true,
                    fields: ['organization_id', 'vendor_code'],
                    name: 'vendors_org_vendor_code_unique',
                },
                {
                    fields: ['vendor_name'],
                    name: 'vendors_vendor_name_idx',
                },
                {
                    fields: ['is_active'],
                    name: 'vendors_is_active_idx',
                },
            ],
        }
    );

    return Vendor;
};