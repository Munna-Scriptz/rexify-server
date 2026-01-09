const userSchema = require("../models/userSchema")
const { sendEmail } = require("../services/emailServices")
const { verifyOtpTemp, forgetPassTemp } = require("../services/emailTemp")
const { generateOTP } = require("../services/helpers")
const { generateAccToken, generateRefToken, genResetPassToken } = require("../services/tokens")
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
        sendEmail({ email, subject: "Email Verification", item: OTP, template: verifyOtpTemp })

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
        res.status(500).send({ message: "Internal server error" })
    }
}

// ========================== Verify OTP ==========================
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body

        // -------- Validations 
        if (!otp) return res.status(400).send({ message: "Invalid or Incorrect OTP" })
        if (!email) return res.status(400).send({ message: "Invalid or Incorrect Email" })

        // --------- Find From DB 
        const user = await userSchema.findOne({
            email,
            otp: Number(otp),
            otpExpires: { $gt: new Date() },
            isVerified: false
        })

        // ------ Validations 
        if (!user) return res.status(400).send({ message: "OTP is invalid or expired" })

        // ------- Modifying DB 
        user.isVerified = true
        user.otp = null
        user.save()


        // ---------- Success 
        res.status(200).send({ message: "Verification Successful" })
    } catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
}


// ========================== Resend OTP ==========================
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).send({ message: "Invalid or Incorrect Email" })
        // --------- Find From DB 
        const user = await userSchema.findOne({
            email,
            isVerified: false
        })
        // ------ Validations 
        if (!user) return res.status(400).send({ message: "User with this email does't exist" })

        // ------- Re-generate otp and expiryTime and send it to db 
        const OTP = generateOTP()
        user.otp = OTP
        user.otpExpires = Date.now() + 5 * 60 * 1000
        user.save()
        sendEmail({ email, subject: "Email Verification", item: OTP, template: verifyOtpTemp })

        // -------------- Success 
        res.status(201).send({ message: "New OTP has been sent!" })
    } catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
}


// ========================== Sign In ==========================
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email) return res.status(400).send({ message: 'Email is required!' })
        if (!password) return res.status(400).send({ message: 'Password is required!' })
        if (!isValidEmail(email)) return res.status(400).send({ message: 'Email is not valid!' })
        // ---------- Existing User 
        const existingUser = await userSchema.findOne({ email })
        if (!existingUser) return res.status(404).send({ message: `User with this email doesn't exists. Please signUp!` })
        if (!existingUser.isVerified) return res.status(400).send({ message: "You're not verified. Please verify your account first" })

        // --------- Compare password 
        const isValidPassword = await existingUser.comparePassword(password)
        if (!isValidPassword) return res.status(400).send({ message: 'Invalid or incorrect password!' })

        // ------------- JWT token and cookie
        const accToken = generateAccToken(existingUser)
        const refToken = generateRefToken(existingUser)
        res.cookie("X-AS-TOKEN", accToken)
        res.cookie("X-RF-TOKEN", refToken)

        // ------------ Success 
        res.status(200).send({ message: "SignIn Successfully completed!" })
    } catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
}

// ========================== Forget password ==========================
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body

        // ----------- Validation 
        if (!email) return res.status(400).send({ message: 'Email is required!' })
        if (!isValidEmail(email)) return res.status(400).send({ message: 'Email is not valid!' })

        // ----------- Find From db
        const existingUser = await userSchema.findOne({ email })
        if (!existingUser) return res.status(400).send({ message: `email is not registered!` })

        // ------------- Send forget link 
        const forgetPassLink = `${process.env.CLIENT_URL || 'http://localhost:5173/'}reset/?sec=${genResetPassToken(existingUser)}`
        sendEmail({ email, subject: "Forget password", item: forgetPassLink, template: forgetPassTemp })

        // --------- Success 
        res.status(200).send({ message: "Reset password link has been sent!" })
    } catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
}



module.exports = { signUp, verifyOTP, resendOTP, signIn, forgetPassword }