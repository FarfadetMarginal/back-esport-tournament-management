const { Sequelize } = require('sequelize');

// Option 1: Passing a connection URI
const sequelize = new Sequelize(process.env.DATABASE_URL) //


const connectDB = async () => {

    try {
        await sequelize.authenticate()
        console.log('connection good')
    } catch (err) {
        console.error('unable to connect to db', err)
    }

}

module.exports = {sequelize, connectDB}