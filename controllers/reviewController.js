const resHandler = require("../utils/resHandler")

// ============ create review 
const createReview = (req, res) => {
    try {
        const { productId, rating, comment } = req.body

        if (!productId) return resHandler.error(res, 400, 'product id is required')
        if (!rating || rating < 1 || rating > 5) return resHandler.error(res, 400, 'rating is required and must be at between 1-5')


        // ----------- Success 
        resHandler.success(res, 200, "Product review added")
    } catch (error) {
        resHandler.error(res, 500, "Internal server error")
    }
}


module.exports = { createReview }