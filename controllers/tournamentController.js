const { sequelize } = require('../config/db')
const User = require('../models/userModel')
const Team = require('../models/teamModel')
const {QueryTypes} = require('sequelize')
const jwt = require('jsonwebtoken')
const Tournament = require('../models/tournamentModel')



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
        })

        return res.status(201).json({
            message : 'tournament added successfully',
            tournament: {
                id: tournament.id,
                name: tournament.name,
                game : tournament.game,
                rules : tournament.rules,
            }
        })
    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}


//US7 : Gérer les membres de mon équipe
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
