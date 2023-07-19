
const mongoose = require("mongoose");

const itemSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        name: {
            type: String,
            required: [true, "Please add a name"],
        },
        price: {
            type: Number,
            required: [true, "Please add a price"],
            trim: true,
        },
        usedby: {
            type: String,
            required: [true, "Please add a usedby"],
            default : "g"
        },
        quantity: {
            type: Number,
            required: [true, "Please add a quantity"],
        }
    },
    {
        timestamps: true,
    }
);

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
