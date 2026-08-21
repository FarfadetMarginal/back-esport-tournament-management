const { sequelize } = require('../config/db')
const User = require('../models/userModel')
const Team = require('../models/teamModel')
const {QueryTypes} = require('sequelize')
const jwt = require('jsonwebtoken')
const Tournament = require('../models/tournamentModel')
const Registration = require('../models/registrationModel')



//US8 : Créer un tournoi ok
exports.createTournament = async (req, res) => {
    try {
        if(!req.user.id){
            return res.status(401).json({message : 'not connected'})
        }
        if(req.user.role != "orga" && req.user.role != "admin"){
            return res.status(401).json({message : 'not authorized'})
        }
        const {name, game, rules, beginDate, endDate} = req.body

        if(!name || !game || !rules || !beginDate || !endDate){
            res.status(400).json({message : 'empty field'})
        }

        if(beginDate>endDate){
            res.status(400).json({message : 'delorean needed'})
        }

        const tournament = await Tournament.create({
            name,
            game, 
            rules,
            beginDate, 
            endDate, 
            user_id : req.user.id
        })

        return res.status(201).json({
            message : 'tournament added successfully',
            tournament: {
                id: tournament.id,
                name: tournament.name,
                game : tournament.game,
                rules : tournament.rules,
                beginDate: tournament.beginDate,
                endDate: tournament.endDate,
                user_id : tournament.user_id
            }
        })
    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}


//US9 : Modifier un tournoi  ok
exports.changeTournament = async (req, res) => {
    try {
        if(req.user.role != "orga" && req.user.role != "admin"){
            return res.status(401).json({message : 'not authorized'})
        }

        const tournament = await Tournament.findByPk(req.params.id)

        if(req.user.role = "orga" && tournament.user_id != req.user.id){
            return res.status(401).json({message : 'not authorized'})
        }

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
        if (req.body.beginDate!=null){
            tournament.beginDate = req.body.beginDate
        }
        if (req.body.endDate!=null){
            tournament.endDate = req.body.endDate
        }

        const updatedtournament = await tournament.save()

        res.status(201).json(updatedtournament)

    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}

//US10 : Supprimer un tournoi  ok
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

//US11 : Inscrire une équipe à un tournoi  ok
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
        
        const existingreg = await Registration.findOne({where:{team_id:team.id, tournament_id:tournament.id}})
        if(existingreg){
            return res.status(401).json({message : 'tournament already joined'})
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

//US12 : Lister les tournois ouverts  ok
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


//US13 : Voir les équipes inscrites à un tournoi  ok
exports.seeMyTournaments = async (req, res) => {
    try {        
        if(!req.user.id){
            return res.status(401).json({message : 'not connected'})
        }
        if(req.user.role != "orga" && req.user.role!="admin"){
            return res.status(401).json({message : 'not authorized'})
        }
        const tournaments = await sequelize.query('SELECT te.name AS team_name, tr.name AS tournament_name FROM "Teams" as te INNER JOIN "Registrations" as r ON te.id = r.team_id INNER JOIN "Tournaments" as tr ON tr.id = r.tournament_id WHERE tr.user_id = :userid ORDER BY tr.name', {replacements: { userid: req.user.id }, type:QueryTypes.SELECT}) 
        
        res.json(tournaments)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}


//US15 : Voir les statistiques de participation  ok
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