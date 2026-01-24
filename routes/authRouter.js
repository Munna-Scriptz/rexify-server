const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer()
const { signUp, verifyOTP, resendOTP, signIn, forgetPassword, resetPassword, getProfile, updateProfile } = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

// -------------------------- Sign Up
router.post('/signUp', signUp)
router.post('/verifyOTP', verifyOTP)
router.post('/resendOTP', resendOTP)
router.post('/signIn', signIn)
router.post('/forgetPassword', forgetPassword)
router.post('/resetPassword/:token', resetPassword)
router.get('/profile', authMiddleware, getProfile)
router.put('/updateProfile', authMiddleware, upload.single("avatar"), updateProfile)


module.exports = router