const cloudinary = require('cloudinary').v2;

const cloudUpload = async ({ file, folderPath, folder }) => {
    const base64String = file.buffer.toString("base64")
    const dataUrl = `data:${file.mimetype};base64,${base64String}`
    return await cloudinary.uploader.upload(dataUrl, { asset_folder: folderPath, folder })
}

const cloudDelete = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { cloudUpload, cloudDelete }