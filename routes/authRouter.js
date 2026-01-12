const express = require('express')
const router = express.Router()
const { signUp, verifyOTP, resendOTP, signIn, forgetPassword, resetPassword } = require('../controllers/authController')
const { authMiddleware } = require('../middleware/authMiddleware')

// -------------------------- Sign Up
router.post('/signUp', signUp)
router.post('/verifyOTP', verifyOTP)
router.post('/resendOTP', resendOTP)
router.post('/signIn', authMiddleware, signIn)
router.post('/forgetPassword', forgetPassword)
router.post('/resetPassword', resetPassword)


module.exports = router