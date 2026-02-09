const categorySchema = require("../models/categorySchema")
const productSchema = require("../models/productSchema")
const { cloudUpload } = require("../services/cloudUpload")
const resHandler = require("../utils/resHandler")

const createProduct = async (req, res) => {
    try {
        const { title, description, category, price, discountPercentage, variants, tags, isActive } = req.body
        const thumbnail = req.files?.thumbnail?.[0]
        const images = req.files?.images

        // ---------- Validation ----------
        if (!title) return resHandler.error(res, 400, 'Title is required')
        if (!description) return resHandler.error(res, 400, 'Description is required')
        if (!category) return resHandler.error(res, 400, 'Category is required')
        const existCategory = await categorySchema.findById(category)
        if (!existCategory) return resHandler.error(res, 400, "Invalid category or doesn't exist")
        if (!price) return resHandler.error(res, 400, 'Price is required')
        if (!thumbnail) return resHandler.error(res, 400, 'Product thumbnail is required')

        // ---------- Upload images ----------
        const thumbRes = await cloudUpload({ file: thumbnail, folderPath: "rexify/products", folder: "product" })

        const imageUrls = []
        if (images) {
            for (const img of images) {
                const uploadRes = await cloudUpload({ file: img, folderPath: "rexify/products", folder: "product" })
                imageUrls.push(uploadRes.secure_url)
            }
        }

        // ---------- Save to DB ----------
        const product = productSchema({
            title,
            description,
            category,
            price,
            discountPercentage,
            images: imageUrls,
            thumbnail: thumbRes.secure_url
        })
        product.save()

        // ------------ Success 
        res.send("Created Successfully")
    } catch (error) {
        console.log(error)
        resHandler.error(res, 500, 'Internal Server Error')
    }
}


module.exports = { createProduct }