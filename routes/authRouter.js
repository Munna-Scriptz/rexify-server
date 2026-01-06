const express = require('express')
const router = express.Router() 
const { signUp, verifyOTP, resendOTP } = require('../controllers/authController')

// -------------------------- Sign Up
router.post('/sign-up', signUp)
router.post('/verifyOTP', verifyOTP)
router.post('/resendOTP', resendOTP)


module.exports = router