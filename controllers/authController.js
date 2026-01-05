const userSchema = require("../models/userSchema")
const { sendEmail } = require("../services/emailServices")
const { verifyOtpTemp } = require("../services/emailTemp")
const { generateOTP } = require("../services/helpers")
const { isValidEmail } = require("../utils/validations")

// ========================== Sign Up ==========================
const signUp = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email) return res.status(400).send({ message: 'Email is required!' })
        if (!password) return res.status(400).send({ message: 'Password is required!' })
        if (!isValidEmail(email)) return res.status(400).send({ message: 'Email is not valid!' })
        // ---------- Existing User 
        const existingUser = await userSchema.findOne({ email })
        if (existingUser) return res.status(400).send({ message: 'User with this email already exists. Please login!' })

        // ------------- Send Email 
        const OTP = generateOTP()
        sendEmail({ email, subject: "Email Verification", OTP: OTP, template: verifyOtpTemp })

        // ----------- Sent to DB 
        const user = new userSchema({
            email,
            password,
            otp: OTP,
            otpExpires: Date.now() + 5 * 60 * 1000
        })

        user.save()


        // ------------------ Success 
        res.status(201).send('Registration Successful')

    } catch (error) {
        console.log(error)
    }
}

// ========================== Verify OTP ==========================
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body


        res.status(200).send({message: "Verification Successful"})
    } catch (error) {
        console.log(error)
    }
}


// ========================== Resend OTP ==========================

// ========================== Sign In ==========================





module.exports = { signUp, verifyOTP }