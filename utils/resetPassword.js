const genResetToken = (data) => {
    try {
        const token = jwt.sign({
            _id: data._id,
            email: data.email

        }, process.env.JWT_SEC, { expiresIn: '2h' });
        return token

    } catch (error) {
        return null
    }
}

const verifyResetToken = (token) => {
    
}

module.exports = { genResetToken, verifyResetToken }
