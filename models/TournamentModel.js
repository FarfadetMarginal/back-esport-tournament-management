const {DataTypes} = require('sequelize')
const {sequelize} = require('../config/db')


const Tournament = sequelize.define('Tournament' ,{
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    game:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    rules:{
        type: DataTypes.STRING,
    },
})


module.exports = Tournament

