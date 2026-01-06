const express = require('express')
const router = express.Router() 
const { signUp, verifyOTP, resendOTP, signIn } = require('../controllers/authController')

// -------------------------- Sign Up
router.post('/signUp', signUp)
router.post('/verifyOTP', verifyOTP)
router.post('/resendOTP', resendOTP)
router.post('/signIn', signIn)


module.exports = router