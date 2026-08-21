const {DataTypes} = require('sequelize')
const {sequelize} = require('../config/db')
const User = require('../models/userModel')

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
    beginDate:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    user_id:{
        type: DataTypes.INTEGER,
        model: User,
        key: 'id',
        allowNull: false,
    },
})

module.exports = Tournament

