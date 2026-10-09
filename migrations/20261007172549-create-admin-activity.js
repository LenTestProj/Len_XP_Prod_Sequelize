'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admin_activity", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },

      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },

      module_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      action_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("admin_activity", ["module_name"]);
    await queryInterface.addIndex("admin_activity", ["action_type"]);
    await queryInterface.addIndex("admin_activity", [
      "module_name",
      "action_type",
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("admin_activity");
  },
};