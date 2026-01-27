const categorySchema = require("../models/categorySchema")
const { cloudUpload } = require("../services/cloudUpload")
const resHandler = require("../utils/resHandler")

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body
        const thumbnail = req.file

        // ---------- Validations 
        const existingCategory = await categorySchema.findOne({ name })
        if (existingCategory) return resHandler.error(res, 400, "Category already exists")
        if (!name) return resHandler.error(res, 400, "Category name is required")
        if (!description) return resHandler.error(res, 400, "Category description is required")
        if (!thumbnail) return resHandler.error(res, 400, "Category thumbnail is required")

        // ---------- Upload image to cloudinary
        const cloudinaryRes = await cloudUpload({ file: thumbnail, folderPath: "rexify/categories", folder: "category" })

        // ----------- Send to DB 
        const category = await categorySchema({
            name,
            description,
            thumbnail: cloudinaryRes.secure_url
        })

        category.save()

        // --------------- Success
        resHandler.success(res, "Category created successfully")
    } catch (error) {
        resHandler.error(res, 500, "Internal server error")
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await categorySchema.find({})
        if(!categories) return resHandler.error(res, 404, "Categories not found")

        // ----------- Send to client 
        resHandler.success(res, 200, undefined, categories)
    } catch (error) {
        resHandler.error(res, 500, "Internal server error")
    }
}

module.exports = { createCategory, getCategories }