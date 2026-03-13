const cartSchema = require("../models/cartSchema")
const productSchema = require("../models/productSchema")
const resHandler = require("../utils/resHandler")
const { ObjectId } = require('mongodb');


// =================== Create 
const createCart = async (req, res) => {
    try {
        const user = req.user._id
        const { product, sku, quantity } = req.body

        // ------------ Validation 
        if (!user) return resHandler.error(res, 400, "invalid request")
        if (!product) return resHandler.error(res, 400, "product is required")
        if (!ObjectId.isValid(product)) return resHandler.error(res, 400, "Invalid product id")
        if (!sku) return resHandler.error(res, 400, "product sku is required")
        if (!quantity || quantity < 1) return resHandler.error(res, 400, "quantity is required and must be at least 1")

        // ---------- Find from DB and validate 
        const existingCart = await cartSchema.findOne({ user })
        const existingProduct = await productSchema.findById(product).select("discountPercentage variants -_id")
        if (!existingProduct) return resHandler.error(res, 404, "couldn't found product")

        // --------- discount and subtotal
        const discountPercentage = existingProduct.discountPercentage
        const variantPrice = existingProduct.variants.find(item => item.sku === sku)?.price;
        if (!variantPrice) return resHandler.error(res, 404, "Wrong product sku")
        const subTotal = variantPrice * quantity * (1 - discountPercentage / 100);

        // ---------- Save to DB 
        if (existingCart) {
            // ---- duplicate check
            const duplicateCart = existingCart.items.some(item => item.sku == sku)
            if (duplicateCart) return resHandler.error(res, 404, "Product already added to cart")

            // ---- cart add
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
        resHandler.error(res, 500, "Internal server error")
    }
}

// =================== update
const updateCart = async (req, res) => {
    try {
        const user = req.user._id
        const { product, sku, quantity } = req.body

        // ------------ Validation 
        if (!user) return resHandler.error(res, 400, "invalid request")
        if (!product) return resHandler.error(res, 400, "product is required")
        if (!ObjectId.isValid(product)) return resHandler.error(res, 400, "Invalid product id")
        if (!sku) return resHandler.error(res, 400, "product sku is required")
        if (!quantity || quantity < 1) return resHandler.error(res, 400, "quantity is required and must be at least 1")

        // ---------- Find from DB 
        const existingCart = await cartSchema.findOne(
            { user, "items.product": product, "items.sku": sku }
        ).select("-user -createdAt -updatedAt -__v")

        const findItem = existingCart.items.find(item => item.sku == sku);

        // --------- Update 
        const subTotal = findItem.subTotal * quantity
        findItem.quantity = quantity;
        findItem.subTotal = subTotal


        await existingCart.save()
        // ----------- Success 
        resHandler.success(res, 201, "Cart updated", existingCart)
    } catch (error) {
        console.log(error)
        resHandler.error(res, 500, "Internal server error")
    }
}



module.exports = { createCart, updateCart }