const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    }
})


module.exports = mongoose.model("category", categorySchema);