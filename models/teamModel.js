const {DataTypes} = require('sequelize')
const {sequelize} = require('../config/db')
const User = require('../models/userModel')



const Team = sequelize.define('Team' ,{

    user_id:{ //1 seul user crée la team = capitaine
        type: DataTypes.INTEGER,
        model: User,
        key: 'id',
        allowNull: false,
    },
    tools:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
})


module.exports = Team