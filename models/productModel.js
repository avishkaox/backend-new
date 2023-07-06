const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        name: {
            type: String,
            required: [true, "Please add a name"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Please add a category"],
            // ref: "Category",
        },
        quantity: {
            type: Number,
            required: [true, "Please add a quantity"],
        },
        sold:{
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, "Please add a price"],
            trim: true,
        },
        soldby: {
            type: String,
            required: [true, "Please add a soldby"],
            trim: true,
            default : "Volume"
        },
        purchaseprice: {
            type: Number,
            required: [true, "Please add a purchaseprice"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Please add a description"],
            trim: true,
        },
        image: {
            type: Object,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
