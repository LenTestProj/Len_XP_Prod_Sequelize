'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Taxes extends Model {
        static associate(models) {
            Taxes.hasMany(models.Items, {
                foreignKey: 'tax_id',
                as: 'items',
            });

            Taxes.hasMany(models.Materials, {
                foreignKey: 'taxId',
                as: 'materials',
            });
        }
    }

    Taxes.init(
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            hsn_code: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },

            tax_type: {
                type: DataTypes.ENUM(
                'GST',
                'VAT',
                'SERVICE_TAX',
                'EXCISE',
                'CESS',
                'CUSTOM_DUTY',
                'OTHER'
                ),
                allowNull: false,
                defaultValue: 'GST',
            },

            description: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },

            cgst: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.00,
            },

            sgst: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.00,
            },

            igst: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.00,
            },

            total_tax: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.00,
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
            modelName: 'Taxes',
            tableName: 'taxes',
            timestamps: true,
            underscored: true,

            indexes: [
                {
                fields: ['tax_type'],
                },
                {
                fields: ['status'],
                },
            ],

            hooks: {
                beforeValidate: (tax) => {
                const cgst = parseFloat(tax.cgst || 0);
                const sgst = parseFloat(tax.sgst || 0);
                const igst = parseFloat(tax.igst || 0);

                tax.total_tax = igst > 0 ? igst : cgst + sgst;
                },
            },
        }
    );

  return Taxes;
};
