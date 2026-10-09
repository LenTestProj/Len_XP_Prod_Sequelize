
'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },

        role_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'admin_roles',
                key: 'id',
            },
        },

        organization_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'organizations',
                key: 'id',
            },
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        mobile: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },

        passwordExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'active',
        },

        reset_otp: {
            type: DataTypes.STRING(6),
            allowNull: true,
        },

        reset_otp_expiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        created_by: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },

        updated_by: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },

        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: 'users',
        timestamps: true,
        underscored: true,
    }
);

module.exports = User;
