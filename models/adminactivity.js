'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminActivity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AdminActivity.init({
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
    },
    module_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

    action_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
  }, {
    sequelize,
    modelName: 'AdminActivity',
    tableName:"admin_activity",
    timestamps: true,
    underscore: true,
    indexes:[
        {
            fields:["module_name"],
        },
        {
            fields:["action_type"], 
        },
        {
            fields: ["module_name", "action_type"], 
        }
    ]
  });
  return AdminActivity;
};