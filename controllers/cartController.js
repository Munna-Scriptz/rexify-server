const cartSchema = require("../models/cartSchema")
const productSchema = require("../models/productSchema")
const resHandler = require("../utils/resHandler")

const createCart = async (req, res) => {
    try {
        const user = req.user._id
        const { product, sku, quantity } = req.body

        // ------------ Validation 
        if (!user) return resHandler.error(res, 400, "invalid request")
        if (!product) return resHandler.error(res, 400, "product is required")
        if (!sku) return resHandler.error(res, 400, "product sku is required")
        if (!quantity || quantity < 1) return resHandler.error(res, 400, "quantity is required and must be at least 1")

        // ---------- Save to DB 
        const existingCart = await cartSchema.findOne({ user })
        const existingProduct = await productSchema.findById(product).select("discountPercentage variants -_id")
        const discountPercentage = existingProduct.discountPercentage
        const variantPrice = existingProduct.variants.find(item => item.sku === sku)?.price;
        const subTotal = variantPrice * quantity * (1 - discountPercentage / 100);

        if (existingCart) {
            existingCart.items.push({
                product,
                sku,
                quantity,
                discountPercentage,
                subTotal
            })

            existingCart.save()
        } else {
            const newCart = cartSchema({
                user,
                items: [{
                    product,
                    sku,
                    quantity,
                    discountPercentage,
                    subTotal
                }]
            })
            newCart.save()
        }

        // ----------- Success 
        resHandler.success(res, 201, "Cart Added")
    } catch (error) {
        console.log(error)
        resHandler.error(res, 500, "Internal server error")
    }
}


module.exports = { createCart }