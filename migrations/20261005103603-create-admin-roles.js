'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admin_roles', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        description:{
            type: Sequelize.STRING(200),
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'active',
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
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

      await queryInterface.addIndex('admin_roles', [
      'name',
      'is_deleted',
    ]);

    await queryInterface.addIndex('admin_roles', ['status']);

    await queryInterface.addIndex('admin_roles', ['is_deleted']);

    await queryInterface.addIndex('admin_roles', [
      'status',
      'is_deleted',
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AdminRoles');
  }
};