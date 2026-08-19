const { sequelize } = require('../config/db')
const User = require('../models/userModel')
const {QueryTypes} = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
 

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '150d'

//helper : on génère des tokens
const generateToken = (id) =>{
    return jwt.sign({id}, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}


//US1 : Création de compte
exports.register = async(req, res)=>{
    try {
        const {email, password, role} = req.body

        if(!email || !password){
            return res.status(400).json({message : 'empty field'})
        }

        const isPasswordOk = validator.isStrongPassword(password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })

        if(!isPasswordOk){
            return res.status(400).json({message: "password not valid : 1 maj 1 min 1 number 1 special chars 6 total required"})
        }

        const isEmailOk = validator.isEmail(email)

        if(!isEmailOk){
            return res.status(400).json({message: "email not valid"})
        }

        const user = await User.create({
            email,
            password, 
            role : role || 'player',
        })

        const token = generateToken(user.id)
        return res.status(201).json({
            message : 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            }
        })
        res.status(201).json(user)
    } catch (err) {
        res.status(500).json({error : err.message})
    }
}

//US2 : Connexion
exports.login = async (req, res) =>{
    try {
        const {email, password} = req.body
        if(!email || !password){
            res.status(400).json({message : 'empty field'})
        }
        //find user and select password field
        const user = await User.findOne({ where: { email } })
        if(!user){
            return res.status(401).json({message : 'invalid credantials'})
        }

        //check password match
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({message : 'incorrect password'})
        }
        const token = generateToken(user.id)

        return res.status(200).json({
            message : 'User login successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            }
        })

    } catch (error) {
        res.status(500).json({message : 'server error during login', error: err.message})
    }
}