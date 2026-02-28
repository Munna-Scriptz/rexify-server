const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: true,
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    variants: [
        {
            sku: {
                type: String,
                required: true,
            },
            color: {
                type: String,
                required: true
            },
            storage: {
                type: Number,
            },
            ram: {
                type: Number,
            },
            price: {
                type: Number,
                required: true,
                min: 1
            },
            stock: {
                type: Number,
                required: true,
                min: 0
            },
            _id: false
        }
    ],
    specifications: {
        display: {
            size: String,
            type: String,
            resolution: String,
            refreshRate: String
        },
        camera: {
            rear: String,
            front: String
        },
        battery: String,
        processor: String,
        network: String,
        weight: String,
        os: String,
        _id: false
    },
    brand: {
        type: String,
    },
    badge: {
        type: String
    },
    warranty: {
        type: String,
        default: "No warranty"
    },
    shipping: {
        type: String,
        default: "Ships in 3-5 business days"
    },
    tags: [
        {
            type: String,
        },
    ],
    thumbnail: {
        type: String,
        // required: true,
    },
    images: [
        {
            type: String,
        },
    ],
    isActive: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });

module.exports = mongoose.model('product', productSchema)