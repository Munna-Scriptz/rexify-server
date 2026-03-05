const resHandler = require("../utils/resHandler")

const createCart = (req, res) => {
    try {

    } catch (error) {
        resHandler.error(res, 500, "Internal server error")
    }
}


module.exports = { createCart }