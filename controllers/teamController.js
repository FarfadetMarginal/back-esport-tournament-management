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



//US6 : Rejoindre une équipe
exports.joinTeam = async (req, res) => {
    try {
        if(!req.user.id){
            return res.status(401).json({message : 'not connected'})
        }
        const team = await Team.findByPk(req.params.id)
        
        if (team==null){
            return res.status(404).json({message :  "team not found"})
        }

        
        const updatedmembers = [...team.members]
        
        if(updatedmembers.includes(req.user.id)){
            return res.status(401).json({message : 'team already joined'})
        }

        if(team.user_id==req.user.id){
            return res.status(401).json({message : 'captain is a member'})
        }

        updatedmembers.push(req.user.id)

        team.members = updatedmembers

        const joinedTeam = await team.save()
        res.status(201).json(joinedTeam)

    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}


//US7 : Gérer les membres de mon équipe
exports.handleTeam = async (req, res) => {
    try {
        if(!req.user.id){
            return res.status(401).json({message : 'not connected'})
        }
        const team = await Team.findByPk(req.params.id)

        if (team==null){
            return res.status(404).json({message :  "team not found"})
        }
        if(req.user.id != team.user_id){
            return res.status(401).json({message : 'not authorized'})
        }

        const { userid } = req.body

        let updatedmembers = [...team.members]
        
        if(team.user_id==userid){
            return res.status(401).json({message : 'captain is a member'})
        }

        if(updatedmembers.includes(userid)){
            updatedmembers = updatedmembers.filter(
                id => id !== userid
            )
        } else {
            updatedmembers.push(userid)
        }

        team.members = updatedmembers

        const joinedTeam = await team.save()
        res.status(201).json(joinedTeam)

    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}