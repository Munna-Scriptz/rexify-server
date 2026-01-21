const cloudinary = require('cloudinary').v2;

const cloudUpload = async (file) => {
    const base64String = file.buffer.toString("base64")
    const dataUrl = `data:${file.mimetype};base64,${base64String}`
    return await cloudinary.uploader.upload(dataUrl)
}

module.exports = { cloudUpload }