const {DataTypes} = require('sequelize')
const {sequelize} = require('../config/db')
const Team = require('../models/teamModel')
const Tournament = require('./TournamentModel')


const Inscription = sequelize.define('Inscription' ,{

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


module.exports = Inscription