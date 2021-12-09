'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Links extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users }) {
      this.belongsTo(Users, { foreignKey: 'id' })
    }
  };
  Links.init({
    userId1: DataTypes.INTEGER,
    userId2: DataTypes.INTEGER,
    friends: DataTypes.BOOLEAN,
    relations: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Links',
  });
  return Links;
};
