const { cloudUpload } = require("../services/cloudUpload")
const resHandler = require("../utils/resHandler")

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body
        const thumbnail = req.file

        // ---------- Validations 
        console.log(name, description, thumbnail)
        if (!name) return resHandler.error(res, 400, "Category name is required")
        if (!description) return resHandler.error(res, 400, "Category description is required")
        if (!thumbnail) return resHandler.error(res, 400, "Category thumbnail is required")

        // ---------- Upload image to cloudinary
        const cloudeRes = await cloudUpload({file: thumbnail, folderPath: "rexify/categories", folder: "category"})

        console.log(cloudeRes) 

        // --------------- Success
        resHandler.success(res, "Category created successfully")
    } catch (error) {
        resHandler.error(res, 500, "Internal server error")
    }
}



module.exports = { createCategory }