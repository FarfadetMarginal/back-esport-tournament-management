const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const { createTournament, changeTournament, deleteTournament, joinTournament } = require('../controllers/tournamentController')

router.post('/new', authMiddleware, createTournament)
router.patch('/change/:id', authMiddleware, changeTournament)
router.delete('/delete/:id', authMiddleware, deleteTournament)
router.post('/join/:id', authMiddleware, joinTournament)


module.exports = router 