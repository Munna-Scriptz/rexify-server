const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true,
    },

    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        sku: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1,
        },
        discountPercentage: {
            type: Number,
        },
        subTotal: {
            type: Number,
            required: true,
        }
    }],

    totalItems: {
        type: Number,
        default: 0,
    },

}, { timestamps: true });

cartSchema.pre("save", function () {
    this.totalItems = this.items?.reduce((acc, item) => acc + item.quantity, 0);
});

module.exports = mongoose.model("cart", cartSchema);