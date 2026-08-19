const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const { createTeam, joinTeam, handleTeam, deleteTeam } = require('../controllers/teamController')

router.post('/new', authMiddleware, createTeam)
router.patch('/join/:id', authMiddleware, joinTeam)
router.patch('/handle/:id', authMiddleware, handleTeam)
router.delete('/delete/:id', authMiddleware, deleteTeam)

module.exports = router 