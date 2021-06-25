const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index');
'use strict';


var bill = sequelize.define('bill', {
  // Model attributes are defined here
  bill_id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: DataTypes.UUIDV4,
  },

  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  
  
}, {
});
var soldDrug = sequelize.define('soldDrug', {
  // Model attributes are defined here

  drug_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
 
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
}, {
});


bill.hasMany(soldDrug,{ foreignKey: 'bill_id' })
module.exports = bill;
module.exports = soldDrug;

