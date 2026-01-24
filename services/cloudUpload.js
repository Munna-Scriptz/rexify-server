const cloudinary = require('cloudinary').v2;

// =================== Upload image 
const cloudUpload = async ({ file, folderPath, folder }) => {
    try {
        const base64String = file.buffer.toString("base64")
        const dataUrl = `data:${file.mimetype};base64,${base64String}`
        return await cloudinary.uploader.upload(dataUrl, { asset_folder: folderPath, folder })
    } catch (error) {
        console.log(error)
    }
}

// =================== Delete image 
const cloudDelete = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { cloudUpload, cloudDelete }