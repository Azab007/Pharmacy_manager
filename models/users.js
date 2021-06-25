const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  // Model attributes are defined here
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true

  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,

  }
}, {
});
module.exports = User;
