'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class organizations extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        // define association here
        }
    }
    organizations.init({
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },

        organisation_code: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },

        organisation_name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        base_currency: {
            type: DataTypes.CHAR(3),
            allowNull: false,
            defaultValue: "GBP",
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        sequelize,
        modelName: 'organisations',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["organisation_code"],
            },
            {
                fields: ["organisation_name"],
            },
            {
                fields: ["is_active"],
            },
        ],
    });
    return organizations;
};