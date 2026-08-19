const { sequelize } = require('../config/db')
const User = require('../models/userModel')
const Team = require('../models/teamModel')
const {QueryTypes} = require('sequelize')
const jwt = require('jsonwebtoken')



//US5 : Créer une équipe
exports.createTeam = async (req, res) => {
    try {
        if(!req.user.id){
            return res.status(401).json({message : 'not connected'})
        }
        const {name} = req.body

        if(!name){
            res.status(400).json({message : 'empty field'})
        }


        const team = await Team.create({
            name,
            user_id : req.user.id,
        })

        return res.status(201).json({
            message : 'team added successfully',
            team: {
                id: team.id,
                name: team.name,
                user_id: team.user_id,
            }
        })
    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}