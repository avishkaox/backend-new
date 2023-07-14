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
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Please add a category"],
            ref: "Category",
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
            enum: ["Unit", "Weight", "Volume" , "Length"],
            required: [true, "Please add a soldby"],
            default : "Volume"
        },
        purchaseprice: {
            type: Number,
            required: [true, "Please add a purchaseprice"],
            trim: true,
        },
        collectlocation: {
            type: String,
            enum: ["Kitchen", "Bar"],
            required: [true, "Please add a Collect Location"],
            trim: true,
        },
        image: {
            type: Object,
            default: {},
        },
        waitingtime: {
            type: String,
            required: [true, "Please add a Waiting Time"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
