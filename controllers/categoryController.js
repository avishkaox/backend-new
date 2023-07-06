const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");

const create = asyncHandler(async (req, res) => {
    // Check if the category is already created
    const category = await Category.findOne({ name: req.body.name });
    if (category) {
        res.status(400).json({ message: "Category already exists" });
    } else {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    }

});

// get all the categories

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.status(200).json(categories);
});


// get single category

const getCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404).json({ message: "Category is not found" });
    } else {
        res.status(200).json(category);
    }
});


// update a single category

const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!category) {
        res.status(404).json({ message: "Category is not found" });
    } else {
        res.status(200).json(category);
    }
});


// Delete a category

const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
        res.status(404).json({ message: "Category is not found" });
    } else {
        res.status(200).json({ message: "Category deleted successfully" });
    }
});


module.exports = {
    create,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory
};