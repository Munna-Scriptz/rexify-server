const resHandler = require("../utils/resHandler")

// ============ create review 
const createReview = (req, res) => {
    try {

    } catch (error) {
        resHandler.error(res, 500, "Internal server error")
    }
}


module.exports = { createReview }