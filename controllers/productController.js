const resHandler = require("../utils/resHandler")

const createProduct = (req, res) => {
    try {
        const { title, description, category, price, discountPercentage, variants, tags, isActive } = req.body

        // ---------- Validation ----------
        if (!title) return resHandler.error(res, 400, 'Title is required')
        if (!description) return resHandler.error(res, 400, 'Description is required')
        if (!category) return resHandler.error(res, 400, 'Category is required')
        if (!price) return resHandler.error(res, 400, 'Price is required')

        // ------------ Success 
        res.send('Create Product')
    } catch (error) {
        resHandler.error(res, 500, 'Internal Server Error')
    }
}


module.exports = { createProduct }