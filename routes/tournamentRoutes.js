const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const { createTournament, changeTournament, deleteTournament, joinTournament, seeTournaments, seeMyTournaments, seeStats } = require('../controllers/tournamentController')

router.post('/new', authMiddleware, createTournament)
router.patch('/change/:id', authMiddleware, changeTournament)
router.delete('/delete/:id', authMiddleware, deleteTournament)
router.post('/join/:id', authMiddleware, joinTournament)
router.get('/see', authMiddleware, seeTournaments)
router.get('/seemy', authMiddleware, seeMyTournaments)
router.get('/seestats', authMiddleware, seeStats)


module.exports = router 