const resHandler = require("../utils/resHandler")

const createProduct = (req, res) => {
    try {



        // ------------ Success 
        res.send('Create Product')
    } catch (error) {
        resHandler.error(res, 500, 'Internal Server Error')
    }
}


module.exports = { createProduct }