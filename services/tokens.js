const jwt = require("jsonwebtoken")


const generateToken = (data) => {
    try {

        const generate = jwt.sign({
            _id: data._id,
            email: data.email

        }, process.env.JWT_SEC, { expiresIn: '2h' });
        console.log(data._id)
        console.log(generate)
    } catch (error) {
        console.log(error)
    }
}





module.exports = { generateToken }