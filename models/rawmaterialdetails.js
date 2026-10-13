'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RawMaterialDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RawMaterialDetails.init({
    item_id: DataTypes.BIGINT,
    material_category: DataTypes.STRING,
    ingredient_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'RawMaterialDetails',
  });
  return RawMaterialDetails;
};