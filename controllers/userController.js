const { sequelize } = require('../config/db')
const User = require('../models/userModel')
const {QueryTypes} = require('sequelize')
const jwt = require('jsonwebtoken')
const validator = require('validator')


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