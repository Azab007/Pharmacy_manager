const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index');

const Drug = sequelize.define('Drug', {
  // Model attributes are defined here
  barcode: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  drug_name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  drug_cat: {
    type: DataTypes.STRING,
    allowNull: false
  },
  drug_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: "1"
  },
  
}, {
});
module.exports = Drug;
