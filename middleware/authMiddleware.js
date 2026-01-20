const { verifyToken } = require("../services/tokens")

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies
        // --------- Validations 
        if (!token["X-RF-TOKEN"]) return res.status(400).send({ message: 'Invalid request' })

        // ------- verify 
        const decoded = verifyToken(token["X-RF-TOKEN"])
        if (!decoded) return res.status(400).send({ message: 'Invalid request' })

        // ----- Set to req 
        req.user = decoded
        next()

    } catch (error) {
        console.log(error)
    }
}


module.exports = authMiddleware