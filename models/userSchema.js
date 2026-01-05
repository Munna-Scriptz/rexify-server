const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    },
    address: {
        type: String,
    },
    otp: {
        type: Number,
        default: null
    },
    otpExpires: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })


// ------------------ password Hash create ----------------
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
    } catch (err) {
        return console.log(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('user', userSchema)