'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organizations', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
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
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('organizations');
  }
};