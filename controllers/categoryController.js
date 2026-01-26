const resHandler = require("../utils/resHandler")

const createCategory = (req, res) => {
    try {
        const { name, description } = req.body

        
    } catch (error) {
        resHandler.error(res, 500, "Internal server error")
    }
}



module.exports = { createCategory }