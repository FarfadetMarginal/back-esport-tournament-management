const {DataTypes} = require('sequelize')
const {sequelize} = require('../config/db')
const Team = require('./teamModel')
const Tournament = require('./tournamentModel')


const Registration = sequelize.define('Registration' ,{

    tournament_id:{
        type: DataTypes.INTEGER,
        model: Tournament,
        key: 'id',
        allowNull: false,
    },
    team_id:{
        type: DataTypes.INTEGER,
        model: Team,
        key: 'id',
        allowNull: false,
    },
})


module.exports = Registration