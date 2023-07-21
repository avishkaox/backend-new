const mongoose = require("mongoose");

const purchasedProductSchema = mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        purchasedDate: {
            type: Date,
            default: Date.now,
        },
        quantity: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

const PurchasedProduct = mongoose.model("PurchasedProduct", purchasedProductSchema);
module.exports = PurchasedProduct;
