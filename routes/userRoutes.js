const express = require('express')
const router = express.Router()
const { updateUser, handleRole, seeRegistrations, handleCap } = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

router.patch('/update', authMiddleware, updateUser)
router.patch('/role/:id', authMiddleware, handleRole)
router.patch('/changecap/:id', authMiddleware, handleCap)
router.get('/myreg', authMiddleware, seeRegistrations)


module.exports = router 