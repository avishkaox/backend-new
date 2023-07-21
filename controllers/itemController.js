const asyncHandler = require("express-async-handler");
const Item = require("../models/itemModel");

// Create Item
const createItem = asyncHandler(async (req, res) => {
    const { name, price, usedby, quantity, user } = req.body;

    // Validation
    if (!name || !price || !usedby || !quantity) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }



    // Check if the Item is already uploaded
    const existingItem = await Item.findOne({ name });
    if (existingItem) {
        res.status(400);
        throw new Error("Item already exists");
    }

    // Create Item
    console.log(req.body);
    const item = await Item.create({
        user,
        name,
        price,
        usedby,
        quantity,
    });

    res.status(201).json(item);
});

// Get all Items
const getItems = asyncHandler(async (req, res) => {
    const items = await Item.find({})
    res.status(200).json(items);
});


// Get all Items
const getItemsforbarchart = asyncHandler(async (req, res) => {
    const items = await Item.find({});
    const barChartData = items.map((item) => ({
        id: item.name, // Use the item name as the identifier for the bar
        value: item.quantity, // Use the item quantity as the value for the bar
    }));
    res.status(200).json(barChartData);
});

// Get single Item
const getItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id)
    // if Item doesn't exist
    if (!item) {
        res.status(404);
        throw new Error("Item not found");
    }
    // Match item to its user
    if (item.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }
    res.status(200).json(item);
});

// Delete Item
const deleteItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);
    // if item doesn't exist
    if (!item) {
        res.status(404);
        throw new Error("Item not found");
    }
    // Match Item to its user
    if (item.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }
    await item.deleteOne();
    res.status(200).json({ message: "Item deleted Successfully." });
});

// Update Item
const updateItem = asyncHandler(async (req, res) => {
    const { name, price, usedby, quantity } = req.body;
    const { id } = req.params;

    const item = await Item.findById(id);

    // if item doesn't exist
    if (!item) {
        res.status(404);
        throw new Error("Item not found");
    }

    // Match Item to its user
    // if (item.user.toString() !== req.user.id) {
    //     res.status(401);
    //     throw new Error("User not authorized");
    // }


    // Update Item
    const updatedItem = await Item.findByIdAndUpdate(
        { _id: id },
        {
            name,
            price,
            usedby,
            quantity,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json(updatedItem);
});

// get list of items queries
const listItem = asyncHandler(async (req, res, next) => {
    // search for item by keyword
    let searchKeyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: "i", // case-insensitive search
            },
        }
        : {};

    try {
        const items = await Item.find(searchKeyword)
            .exec();

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500);
        next(error);
    }
});

module.exports = {
    createItem,
    getItems,
    getItem,
    deleteItem,
    updateItem,
    getItemsforbarchart,
    listItem,
};
