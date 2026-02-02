const { cloudUpload } = require("../services/cloudUpload")
const resHandler = require("../utils/resHandler")

const createProduct = async (req, res) => {
    try {
        const { title, description, category, price, discountPercentage, variants, tags, isActive } = req.body
        const thumbnail = req.files?.thumbnail?.[0]
        const images = req.files.images

        // ---------- Validation ----------
        // if (!title) return resHandler.error(res, 400, 'Title is required')
        // if (!description) return resHandler.error(res, 400, 'Description is required')
        // if (!category) return resHandler.error(res, 400, 'Category is required')
        // if (!price) return resHandler.error(res, 400, 'Price is required')

        // ---------- Upload images ----------
        // const uploadRes = await cloudUpload({ file: thumbnail, folderPath: "rexify/products", folder: "product" })

        if (images) {
            for (const img of images) {
                const uploadRes = await cloudUpload({ file: img, folderPath: "rexify/products", folder: "product" })
                console.log(uploadRes)
            } 
        }
 

        // ------------ Success 
        res.send("Created Successfully")
    } catch (error) {
        console.log(error)
        resHandler.error(res, 500, 'Internal Server Error')
    }
}


module.exports = { createProduct }