'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Links }) {
      this.hasMany(Links, { foreignKey: 'friends' }),
        this.hasMany(Links, { foreignKey: 'relations' })
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    bDay: DataTypes.DATEONLY,
    dDay: DataTypes.DATEONLY,
    addres: DataTypes.STRING,
    age: DataTypes.INTEGER,
    skills: DataTypes.STRING,
    wishes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
