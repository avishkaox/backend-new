const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require('../utils/cloudinary');

// Create Product
const createProduct = asyncHandler(async (req, res) => {
    const { name, category, price, collectlocation, waitingtime } = req.body;

    // Validation
    if (!name || !category || !price || !collectlocation || !waitingtime) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }

    // Handle Image upload
    let fileData = {};
    if (req.file) {
        // Save image to cloudinary
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                folder: "back end App",
                resource_type: "image",
            });
        } catch (error) {
            res.status(500);
            throw new Error("Image could not be uploaded");
        }

        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        };
    }

    // Check if the product is already uploaded
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
        res.status(400);
        throw new Error("Product already exists");
    }

    // Check if the image is empty
    if (!fileData.filePath) {
        res.status(400);
        throw new Error("Please upload an image");
    }

    // Create Product
    const product = await Product.create({
        user: req.user.id,
        name,
        category,
        price,
        waitingtime,
        collectlocation,
        image: fileData,
    });

    res.status(201).json(product);
});

// Get all Products
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).populate("category");
    res.status(200).json(products);
});

// Get single product
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate("category");
    // if product doesn't exist
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    // Match product to its user
    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }
    res.status(200).json(product);
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    // if product doesn't exist
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    // Match product to its user
    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }
    await product.deleteOne();
    res.status(200).json({ message: "Product deleted Successfully." });
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
    const { name, category, price, collectlocation, waitingtime } = req.body;
    const { id } = req.params;

    const product = await Product.findById(id);

    // if product doesn't exist
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    // Match product to its user
    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    // Handle Image upload
    let fileData = {};
    if (req.file) {
        // Save image to cloudinary
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                folder: "Resturent Management System",
                resource_type: "image",
            });
        } catch (error) {
            res.status(500);
            throw new Error("Image could not be uploaded");
        }

        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        };
    }

    // Update Product
    const updatedProduct = await Product.findByIdAndUpdate(
        { _id: id },
        {
            name,
            category,
            price,
            waitingtime,
            collectlocation,
            image: Object.keys(fileData).length === 0 ? product?.image : fileData,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json(updatedProduct);
});

// get list of products queries
const list = asyncHandler(async (req, res, next) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    // search for products by keyword
    let searchKeyword = req.query.keyword
        ? {
              name: {
                  $regex: req.query.keyword,
                  $options: "i", // case-insensitive search
              },
          }
        : {};

    try {
        const products = await Product.find(searchKeyword)
            .sort([[sortBy, order]])
            .limit(limit)
            .populate("category")
            .exec();

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500);
        next(error);
    }
});

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    list,
};
