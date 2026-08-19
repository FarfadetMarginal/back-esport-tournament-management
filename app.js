const express = require('express')
const app = express()
const port = 3005
require('dotenv').config()


const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')


const {sequelize, connectDB} = require('./config/db') 
const startServer = async () =>{
    await connectDB()
    //créer les tables si elles n'existent pas

    await sequelize.sync({ alter :true })
    console.log('tables synchronized') 

} 
startServer()

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const teamRoutes = require('./routes/teamRoutes')


app.use(express.json())
app.use(express.urlencoded({extended: true}))

const corsOption = {
    origin: ['http://localhost:3005']
}
app.use(cors(corsOption))

app.use(
    helmet({
        contentSecurityPolicy: false, //pour API JSON uniquement, désactive CSP
        crossOriginResourcePolicy: {policy: "cross-origin"}, 
    })
)

const limiter = rateLimit({
    windowMs : 15*60*1000, //fenetre de 15minutes
    limit : 100, //max 100 requêtes par IP sur ce creneau
    message : {status: 429, error: 'trop de requête'}
})
app.use(limiter)

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/team', teamRoutes)

// l'URL ↓
app.get('/', (req, res) =>{
    res.send("jusqu'ici tout va bien")
}) 

app.listen(port, () =>{
    console.log(`serveur démarré sur http://localhost:${port}`)
})