const {DataTypes} = require('sequelize')
const {sequelize} = require('../config/db')
const bcrypt = require('bcryptjs')

const User = sequelize.define('User' ,{

    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true,
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    role:{
        type: DataTypes.ENUM,
        values: ['player', 'orga', 'admin']
    }
},{
    hooks:{
        beforeSave: async (user) =>{
        if(!user.changed('password')) return;
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        }
    }
})


//comparer le mdp input avec le mdp hashé

User.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}


module.exports = User