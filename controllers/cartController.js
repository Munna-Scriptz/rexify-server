const resHandler = require("../utils/resHandler")

const createCart = () => {
    try {

    } catch (error) {
        resHandler.error(res, 500, "Internal server error")
    }
}


module.exports = { createCart }