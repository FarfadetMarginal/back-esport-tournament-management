const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const { createTournament, changeTournament, deleteTournament } = require('../controllers/tournamentController')

router.post('/new', authMiddleware, createTournament)
router.patch('/change/:id', authMiddleware, changeTournament)
router.delete('/delete/:id', authMiddleware, deleteTournament)


module.exports = router 