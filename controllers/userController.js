const { sequelize } = require('../config/db')
const User = require('../models/userModel')
const {QueryTypes} = require('sequelize')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const Team = require('../models/teamModel')


//US4 : Modifier mon profil
exports.updateUser = async (req, res) => {
    try {
        if(!req.user.id){
            return res.status(401).json({message : 'not connected'})
        }

        const changedUser = await User.findByPk(req.user.id)

        if (req.body.email!=null){
            changedUser.email = req.body.email
        }
        if (req.body.password!=null){
            changedUser.password = req.body.password
        }

        const isPasswordOk = validator.isStrongPassword(changedUser.password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })

        if(!isPasswordOk){
            return res.status(400).json({message: "password not valid : 1 maj 1 min 1 number 1 special chars 6 total required"})
        }

        const isEmailOk = validator.isEmail(changedUser.email)

        if(!isEmailOk){
            return res.status(400).json({message: "email not valid"})
        }

        const updatedUser = await changedUser.save()

        res.status(201).json(updatedUser)
    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}


//US16 : Gérer les rôles utilisateurs  ok
exports.handleRole = async (req, res) => {
    try {
        if(req.user.role != "admin"){
            return res.status(401).json({message : 'not authorized'})
        }

        const changedUser = await User.findByPk(req.params.id)

        if (req.body.role!=null){
            changedUser.role = req.body.role
        }

        const updatedUser = await changedUser.save()

        res.status(201).json(updatedUser)
    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}


//US16 : Gérer les rôles utilisateurs  ok
exports.handleCap = async (req, res) => {
    try {
        if(req.user.role != "admin"){
            return res.status(401).json({message : 'not authorized'})
        }

        const {userid} = req.body
        const changedUser = await User.findByPk(userid)
        const changedTeam = await Team.findByPk(req.params.id)

        if(changedTeam == null){
            return res.status(404).json({message :  "team not found"})
        }

        if(changedUser == null && !changedTeam.includes(changedUser.id)){
            return res.status(404).json({message :  "user not found or not in the team"})
        }

        changedTeam.user_id = userid

        const updatedTeam = await changedTeam.save()

        res.status(201).json(updatedTeam)
    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}

//US18 : Consulter mes inscriptions à des tournois  ok
exports.seeRegistrations = async (req, res) => {
    try {        
        if(!req.user.id){
            return res.status(401).json({message : 'not connected'})
        }
        const reg = await sequelize.query('SELECT tour.name FROM "Tournaments" AS tour INNER JOIN "Registrations" AS r ON tour.id = r.tournament_id INNER JOIN "Teams" AS te ON r.team_id = te.id INNER JOIN "Users" AS u ON u.id = ANY(te.members) WHERE u.id = :id ', {replacements: { id: req.user.id }, type:QueryTypes.SELECT})
        res.json(reg)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}
