const express = require('express')
const router = express.Router() 
const { signUp, verifyOTP } = require('../controllers/authController')

// -------------------------- Sign Up
router.post('/sign-up', signUp)

router.post('/verifyOTP', verifyOTP)


module.exports = router