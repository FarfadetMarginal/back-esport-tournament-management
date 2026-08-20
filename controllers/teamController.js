const { sequelize } = require('../config/db')
const User = require('../models/userModel')
const Team = require('../models/teamModel')
const {QueryTypes} = require('sequelize')
const jwt = require('jsonwebtoken')



//US5 : Créer une équipe  ok
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
            members : [req.user.id]
        })

        return res.status(201).json({
            message : 'team added successfully',
            team: {
                id: team.id,
                name: team.name,
                user_id: team.user_id,
                members: team.members,
            }
        })
    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}



//US6 : Rejoindre une équipe  ok
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


        updatedmembers.push(req.user.id)

        team.members = updatedmembers

        const joinedTeam = await team.save()
        res.status(201).json(joinedTeam)

    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}


//US7 : Gérer les membres de mon équipe  ok
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

//US14 : Supprimer une équipe (admin uniquement) 
exports.deleteTeam = async (req, res) => {
    try {
        if(req.user.role!="admin"){
            return res.status(401).json({message : 'not authorized'})
        }

        const team = await Team.findByPk(req.params.id)
        if (team==null){
            return res.status(404).json({message : "team not found"})
        }
        await team.destroy()
        res.json({message : "team deleted"})
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

//US17 : Consulter le détail d’une équipe  ok
exports.seeTeams = async (req, res) => {
    try {        
        if(!req.user.id){
            return res.status(401).json({message : 'not connected'})
        }
        const teams = await sequelize.query('SELECT t.name, u.email FROM "Teams" AS t INNER JOIN "Users" AS u on u.id = ANY(t.members) WHERE t.id = :id ', {replacements: { id: req.params.id }, type:QueryTypes.SELECT})
        res.json(teams)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}
