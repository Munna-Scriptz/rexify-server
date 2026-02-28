const categorySchema = require("../models/categorySchema")
const productSchema = require("../models/productSchema")
const { cloudUpload } = require("../services/cloudUpload")
const resHandler = require("../utils/resHandler")

// =============== Create Product ==================
const createProduct = async (req, res) => {
    try {
        const { title, slug, description, category, price, discountPercentage, variants, specifications, brand, badge, warranty, shipping, tags, isActive } = req.body
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

        // Variants 
        if (!Array.isArray(variants) || variants.length == 0) return resHandler.error(res, 400, 'Variants is required')
        for (const variant of variants) {
            if (!variant.sku) return resHandler.error(res, 400, 'Product SKU is required')
            if (!variant.color) return resHandler.error(res, 400, 'Product color is required')
            if (!variant.ram) return resHandler.error(res, 400, 'Product RAM is required')
            if (!variant.storage) return resHandler.error(res, 400, 'Product Storage is required')
            if (!variant.price) return resHandler.error(res, 400, 'Product price is required')
            if (!variant.stock || variant.stock < 1) return resHandler.error(res, 400, 'Stock is required and must be at least 1')
        }
        const AllSku = variants.map(item => item.sku)
        if (new Set(AllSku).size !== AllSku.length) return resHandler.error(res, 400, 'SKU with this name already exists')

        // Specifications
        if(!specifications.display.size) return resHandler.error(res, 400, 'Specification display size required')
        if(!specifications.display.type) return resHandler.error(res, 400, 'Specification display type required')
        if(!specifications.display.resolution) return resHandler.error(res, 400, 'Specification display resolution required')
        if(!specifications.display.refreshRate) return resHandler.error(res, 400, 'Specification display refreshRate required')

        if(!specifications.camera.rear) return resHandler.error(res, 400, 'Specification camera rear required')

        if(!specifications.battery) return resHandler.error(res, 400, 'Specification battery required')
        if(!specifications.processor) return resHandler.error(res, 400, 'Specification processor required')
        if(!specifications.network) return resHandler.error(res, 400, 'Specification network required')
        if(!specifications.weight) return resHandler.error(res, 400, 'Specification weight required')
        if(!specifications.os) return resHandler.error(res, 400, 'Specification os required')


        // ---------- Upload images ----------
        // if (!thumbnail) return resHandler.error(res, 400, 'Product thumbnail is required')
        // const thumbRes = await cloudUpload({ file: thumbnail, folderPath: "rexify/products", folder: "product" })

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
            specifications,
            images: imageUrls,
            // thumbnail: thumbRes.secure_url,
            brand,
            badge,
            warranty,
            shipping,
            tags,
            isActive
        })
        product.save()

        // ------------ Success 
        resHandler.success(res, 201, "Product created successfully")
    } catch (error) {
        console.log(error)
        resHandler.error(res, 500, 'Internal Server Error')
    }
}

// =============== Get all Product ==================
const getAll = async (req, res) => {
    try {
        // --------- query
        const categorySlug = req.query.category
        const limit = parseInt(req.query.limit) || 10
        const page = parseInt(req.query.page) || 1
        const skip = (page - 1) * limit

        // --------- Count & Page
        const productsCount = await productSchema.countDocuments()
        const totalPages = Math.ceil(productsCount / limit)

        // --------- Search and Pipeline
        const pipline = [
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $match: { "isActive": true, ...(categorySlug && { "category.slug": categorySlug }) } },
            { $unwind: "$category" },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            { $project: { __v: 0, isActive: 0, updatedAt: 0, "category.__v": 0, "category.isActive": 0, "category._id": 0, "variants._id": 0 } }
        ]
        // ---------- Find product 
        const products = await productSchema.aggregate(pipline)

        // ---------- Success 
        resHandler.success(res, 201, "", {
            products,
            pagination: {
                total: productsCount,
                showing: products?.length || 0,
                page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        })
    } catch (error) {
        resHandler.error(res, 500, 'Internal Server Error')
    }
}

// =============== Get Single Product ==================
const getSingle = async (req, res) => {
    try {
        const { slug } = req.params

        // ------- Find from DB
        const product = await productSchema.findOne({ slug }).select("-__v -isActive -updatedAt ")
        if (!product) return resHandler.error(res, 404, "Coudn't found any product")

        // --------- Success 
        resHandler.success(res, 200, "", product)
    } catch (error) {
        resHandler.error(res, 500, 'Internal Server Error')
    }
}

// =============== Update Product ==================
const updateProduct = async (req, res) => {
    try {
        const productSlug = req.params.slug
        const thumbnail = req.file
        const { title, slug, description, category, price, discountPercentage, variants, brand, badge, weight, warranty, shipping, power, tags, isActive } = req.body

        // ---------- Validation ----------
        const existSlug = await productSchema.findOne({ slug: slug?.toLowerCase() })
        if (existSlug) return resHandler.error(res, 400, 'Slug with this name already exists')
        if (variants) {
            for (const variant of variants) {
                if (variant.stock < 1) return resHandler.error(res, 400, 'Stock must be at least 1')
            }
        }
        if (category) {
            const existCategory = await categorySchema.findById(category)
            if (!existCategory) return resHandler.error(res, 400, "Invalid category or doesn't exist")
        }

        // ------- Find from DB
        const existingProduct = await productSchema.findOne({ slug: productSlug })
        if (!existingProduct) return resHandler.error(res, 404, "Coudn't found any product")

        if (title) existingProduct.title = title
        if (slug) existingProduct.slug = slug.toLowerCase()
        if (description) existingProduct.description = description
        if (category) existingProduct.category = category
        if (price) existingProduct.price = price
        if (discountPercentage) existingProduct.discountPercentage = discountPercentage
        if (variants) existingProduct.variants = variants
        if (brand) existingProduct.brand = brand
        if (badge) existingProduct.badge = badge
        if (weight) existingProduct.weight = weight
        if (warranty) existingProduct.warranty = warranty
        if (shipping) existingProduct.shipping = shipping
        if (power) existingProduct.power = power
        if (tags) existingProduct.tags = tags


        // ------------ Images -------------
        if (thumbnail) {
            const productThumb = existingProduct.thumbnail.split("/").pop().split(".").shift()
            // --- Delete previous thumbnail
            cloudDelete(`thumbnail/${productThumb}`)
            const cloudRes = await cloudUpload({ file: thumbnail, folderPath: "rexify/products", folder: "product" })
            existingProduct.thumbnail = cloudRes.secure_url
        }
        existingProduct.save()


        // --------- Success 
        resHandler.success(res, 200, "Product updated successfully")
    } catch (error) {
        resHandler.error(res, 500, 'Internal Server Error')
    }
}



module.exports = { createProduct, getAll, getSingle, updateProduct }