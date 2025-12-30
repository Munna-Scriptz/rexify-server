const express = require('express')
const router = express.Router() 
const { signUp } = require('../controllers/authController')

// -------------------------- Sign Up
router.post('/sign-up', signUp)

module.exports = router