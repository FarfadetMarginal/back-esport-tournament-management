const {DataTypes} = require('sequelize')
const {sequelize} = require('../config/db')
const User = require('../models/userModel')



const Team = sequelize.define('Team' ,{

    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id:{ //1 seul user crée la team = capitaine
        type: DataTypes.INTEGER,
        model: User,
        key: 'id',
        allowNull: false,
    },
    members:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: []
    },
}) 


module.exports = Team