const categorySchema = require("../models/categorySchema")
const productSchema = require("../models/productSchema")
const { cloudUpload } = require("../services/cloudUpload")
const resHandler = require("../utils/resHandler")

// =============== Create Product ==================
const createProduct = async (req, res) => {
    try {
        const { title, slug, description, category, price, discountPercentage, variants, brand, badge, weight, warranty, shipping, power, tags, isActive } = req.body
        const thumbnail = req.files?.thumbnail?.[0]
        const images = req.files?.images

        // ---------- Validation ----------
        if (!title) return resHandler.error(res, 400, 'Title is required')
        // Slug 
        if (!slug) return resHandler.error(res, 400, 'Slug is required')
        const existSlug = await productSchema.findOne({ slug: slug.toLowerCase() })
        if (existSlug) return resHandler.error(res, 400, 'Slug with this name already exists')
        if (!description) return resHandler.error(res, 400, 'Description is required')
        // category 
        if (!category) return resHandler.error(res, 400, 'Category is required')
        const existCategory = await categorySchema.findById(category)
        if (!existCategory) return resHandler.error(res, 400, "Invalid category or doesn't exist")
        if (!price) return resHandler.error(res, 400, 'Price is required')
        // Variants 
        if (!Array.isArray(variants) || variants.length == 0) return resHandler.error(res, 400, 'Variants is required')
        for (const variant of variants) {
            if (!variant.sku) return resHandler.error(res, 400, 'Product SKU is required')
            if (!variant.color) return resHandler.error(res, 400, 'Product color is required')
            if (!variant.ram) return resHandler.error(res, 400, 'Product RAM is required')
            if (!variant.storage) return resHandler.error(res, 400, 'Product Storage is required')
            if (!variant.stock || variant.stock < 1) return resHandler.error(res, 400, 'Stock is required and must be at least 1')
        }
        // SKU 
        const AllSku = variants.map(item => item.sku)
        if (new Set(AllSku).size !== AllSku.length) return resHandler.error(res, 400, 'SKU with this name already exists')



        // ---------- Upload images ----------
        if (!thumbnail) return resHandler.error(res, 400, 'Product thumbnail is required')
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
            slug: slug.toLowerCase(),
            description,
            category,
            price,
            discountPercentage,
            variants,
            images: imageUrls,
            thumbnail: thumbRes.secure_url,
            brand,
            badge,
            weight,
            warranty,
            shipping,
            power,
            tags,
            isActive
        })
        product.save()

        // ------------ Success 
        resHandler.success(res, 201, "Product created successfully")
    } catch (error) {
        resHandler.error(res, 500, 'Internal Server Error')
    }
}

// =============== Get Product ==================
const getAll = async (req, res) => {
    try {
        // --------- query
        const category = req.query.category
        const limit = parseInt(req.query.limit) || 10
        const page = parseInt(req.query.page) || 1
        const skip = (page - 1) * limit

        console.log(category)

        const products = await productSchema.find({})

        // ---------- Success 
        resHandler.success(res, 201, "Product created successfully", products)
    } catch (error) {
        resHandler.error(res, 500, 'Internal Server Error')
    }
}



module.exports = { createProduct, getAll }