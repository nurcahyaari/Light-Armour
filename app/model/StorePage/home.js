'use strict'

let db = require('../../config/database');
let Sequelize = require('sequelize');

const Index = db.define('index', {
    idKey : {
        type: Sequelize.STRING, 
        allowNull: false, 
        defaultValue: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    count: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false, // don't make a timestamp
    freezeTableName: true // don't make a plural tables name
});



module.exports = Index;