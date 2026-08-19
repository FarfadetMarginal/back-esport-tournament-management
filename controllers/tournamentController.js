const { sequelize } = require('../config/db')
const User = require('../models/userModel')
const Team = require('../models/teamModel')
const {QueryTypes} = require('sequelize')
const jwt = require('jsonwebtoken')
const Tournament = require('../models/tournamentModel')
const Registration = require('../models/registrationModel')



//US8 : Créer un tournoi
exports.createTournament = async (req, res) => {
    try {
        if(!req.user.id){
            return res.status(401).json({message : 'not connected'})
        }
        if(req.user.role != "orga" && req.user.role != "admin"){
            return res.status(401).json({message : 'not authorized'})
        }
        const {name, game, rules} = req.body

        if(!name || !game || !rules){
            res.status(400).json({message : 'empty field'})
        }

        const tournament = await Tournament.create({
            name,
            game, 
            rules,
            user_id : req.user.id
        })

        return res.status(201).json({
            message : 'tournament added successfully',
            tournament: {
                id: tournament.id,
                name: tournament.name,
                game : tournament.game,
                rules : tournament.rules,
                user_id : tournament.user_id
            }
        })
    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}


//US9 : Modifier un tournoi
exports.changeTournament = async (req, res) => {
    try {
        if(req.user.role != "orga" && req.user.role != "admin"){
            return res.status(401).json({message : 'not authorized'})
        }

        const tournament = await Tournament.findByPk(req.params.id)
        if (tournament==null){
            return res.status(404).json({message :  "tournament not found"})
        }
        if (req.body.name!=null){
            tournament.name = req.body.name
        }
        if (req.body.game!=null){
            tournament.game = req.body.game
        }
        if (req.body.rules!=null){
            tournament.rules = req.body.rules
        }

        const updatedtournament = await tournament.save()

        res.status(201).json(updatedtournament)

    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}

//US10 : Supprimer un tournoi
exports.deleteTournament = async (req, res) => {
    try {
        if(req.user.role != "orga" && req.user.role!="admin"){
            return res.status(401).json({message : 'not authorized'})
        }

        const tournament = await Tournament.findByPk(req.params.id)
        if (tournament==null){
            return res.status(404).json({message : "tournament not found"})
        }
        await tournament.destroy()
        res.json({message : "tournament deleted"})
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

//US11 : Inscrire une équipe à un tournoi
exports.joinTournament = async (req, res) => {
    try {

        const tournament = await Tournament.findByPk(req.params.id)
        const { teamid } = req.body
        const team = await Team.findByPk(teamid)
        
        if (team==null){
            return res.status(404).json({message :  "team not found"})
        }
        if (tournament==null){
            return res.status(404).json({message :  "tournament not found"})
        }
        if(!req.user.id){
            return res.status(401).json({message : 'not connected'})
        }
        if(req.user.id != team.user_id && !team.members.includes(req.user.id)){
            return res.status(401).json({message : 'not authorized : need to be in the team'})
        }
        
        const registration = await Registration.create({
            tournament_id : tournament.id,
            team_id : team.id,

        })

        return res.status(201).json({
            message : 'tournament joined successfully',
            registration: {
                tournament_id : registration.tournament_id,
                team_id : registration.team_id,
            }
        })
        
    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}

//US12 : Lister les tournois ouverts
exports.seeTournaments = async (req, res) => {
    try {        
        if(!req.user.id){
            return res.status(401).json({message : 'not connected'})
        }
        const tournaments = await sequelize.query('SELECT name, game, rules FROM "Tournaments" ', {type:QueryTypes.SELECT})
        res.json(tournaments)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}


//US13 : Voir les équipes inscrites à un tournoi
exports.seeMyTournaments = async (req, res) => {
    try {        
        if(!req.user.id){
            return res.status(401).json({message : 'not connected'})
        }
        if(req.user.role != "orga" && req.user.role!="admin"){
            return res.status(401).json({message : 'not authorized'})
        }
        const tournaments = await sequelize.query('SELECT te.name AS team_name, tr.name AS tournament_name FROM "Teams" as te INNER JOIN "Registrations" as r ON te.id = r.team_id INNER JOIN "Tournaments" as tr ON tr.id = r.tournament_id WHERE tr.user_id = :userid', {replacements: { userid: req.user.id }, type:QueryTypes.SELECT}) 
        
        res.json(tournaments)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}


//US15 : Voir les statistiques de participation
exports.seeStats = async (req, res) => {
    try {        
        if(!req.user.id){
            return res.status(401).json({message : 'not connected'})
        }
        if(req.user.role!="admin"){
            return res.status(401).json({message : 'not authorized'})
        }
        const stats = await sequelize.query('SELECT tr.name, COUNT(*) AS team_number FROM "Registrations" as r INNER JOIN "Tournaments" as tr ON tr.id = r.tournament_id GROUP BY tr.name', {type:QueryTypes.SELECT}) 
        
        res.json(stats)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

//SELECT events.name_event, COUNT(*) AS number_enjoyer FROM bookings INNER JOIN events ON bookings.fk_id_event = id_event GROUP BY events.name_event;