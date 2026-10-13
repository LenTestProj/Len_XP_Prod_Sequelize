'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {
            Users.belongsTo(models.AdminRoles, {
                foreignKey: 'role_id',
                as: 'role',
            });

            Users.belongsTo(models.Organizations, {
                foreignKey: 'organization_id',
                as: 'organization',
            });

            Users.hasMany(models.AdminActivity, {
                foreignKey: 'user_id',
                as: 'activities',
            });

            Users.hasMany(models.FormulationVersions, {
                foreignKey: 'approved_by',
                as: 'approvedFormulationVersions',
            });
        }
    }

    Users.init(
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
            sequelize,
            modelName: 'Users',
            tableName: 'users',
            timestamps: true,
            underscored: true,
        }
    );

    return Users;
};