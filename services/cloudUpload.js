const cloudinary = require('cloudinary').v2;

const cloudUpload = async (file) => {
    const base64String = file.buffer.toString("base64")
    const dataUrl = `data:${file.mimetype};base64,${base64String}`
    return await cloudinary.uploader.upload(dataUrl)
}

const cloudDelete = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        console.log(result)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { cloudUpload, cloudDelete }