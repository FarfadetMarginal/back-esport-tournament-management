const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const { createTeam, joinTeam, handleTeam, deleteTeam, seeTeams } = require('../controllers/teamController')

router.post('/new', authMiddleware, createTeam)
router.patch('/join/:id', authMiddleware, joinTeam)
router.patch('/handle/:id', authMiddleware, handleTeam)
router.delete('/delete/:id', authMiddleware, deleteTeam)
router.get('/see/:id', authMiddleware, seeTeams)

module.exports = router 