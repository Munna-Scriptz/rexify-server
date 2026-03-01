const reviewSchema = require("../models/reviewSchema")
const resHandler = require("../utils/resHandler")
const { ObjectId } = require('mongodb');

// ============ create review 
const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body
        const user = req?.user?._id

        if (!productId) return resHandler.error(res, 400, 'product id is required')
        if (!ObjectId.isValid(productId)) return resHandler.error(res, 400, 'invalid object id')
        if (!rating || rating < 1 || rating > 5) return resHandler.error(res, 400, 'rating is required and must be at between 1-5')
        if (!user) return resHandler.error(res, 404, 'review user not found')

        const existingReview = await reviewSchema.findOne({ user, product: productId })
        if (existingReview) return resHandler.error(res, 400, 'review already created')

        // ------------- Save to DB 
        const newReview = await reviewSchema({
            product: productId,
            user,
            rating,
            comment
        })
        newReview.save()

        // ----------- Success 
        resHandler.success(res, 200, "Product review added")
    } catch (error) {
        resHandler.error(res, 500, "Internal server error")
    }
}


module.exports = { createReview }