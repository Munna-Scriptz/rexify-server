const jwt = require("jsonwebtoken")


const generateAccToken = (data) => {
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

const generateRefToken = (data) => {
    try {
        const token = jwt.sign({
            _id: data._id,
            email: data.email

        }, process.env.JWT_SEC, { expiresIn: '15d' });
        return token

    } catch (error) {
        console.log(error)
    }
}





module.exports = { generateAccToken, generateRefToken }