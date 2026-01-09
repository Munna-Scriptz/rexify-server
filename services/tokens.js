const jwt = require("jsonwebtoken")


const generateToken = (data) => {
    try {
        const token = jwt.sign({
            _id: data._id,
            email: data.email

        }, process.env.JWT_SEC, { expiresIn: '2h' });
        return token

    } catch (error) {
        console.log(error)
    }
}





module.exports = { generateToken }