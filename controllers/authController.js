const userSchema = require("../models/userSchema")
const { sendEmail } = require("../services/emailServices")
const { generateOTP } = require("../services/helpers")
const { isValidEmail } = require("../utils/validations")

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
        sendEmail({email, subject: "Email Verification", OTP: OTP})

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






module.exports = { signUp }