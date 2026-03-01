const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
    {
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

        subTotal: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            unique: true,
        },

        items: [cartItemSchema],

        totalItems: {
            type: Number,
            default: 0,
        },

        totalPrice: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

cartSchema.pre("save", function () {
    this.totalItems = this.items.reduce((acc, item) => acc + item.quantity, 0);
    this.totalPrice = this.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
});

module.exports = mongoose.model("cart", cartSchema);