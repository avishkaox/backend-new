

const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const path = require("path");

var _ = require('lodash');


// cart functionality

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
    const { productid, quantity } = req.body;



    const product = await Product.findById(productid);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [] });
    }

    let existingItem = [];
    cart.items.map(item => {
        if (item.productid == productid) {
            existingItem.push(item);
            console.log('here')
            return;
        }
    })

    if (existingItem.length > 0) {
        // If the item exists, update the quantity
        existingItem.quantity += quantity;
    } else {
        // If the item doesn't exist, add it to the cart
        cart.items.push({ productid: productid, quantity });
    }
    await cart.save();
    res.status(201).json(cart);
});

// Get cart items
const getCartItems = asyncHandler(async (req, res) => {
    // Fetch all carts from the database
    const allCarts = await Cart.find({}).populate({
        path: "items.productid",
        model: "Product",
    });

    res.status(200).json(allCarts);
});

// Update cart item quantity
const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { itemId, quantity } = req.body;

    const cart = await Cart.findOne({});
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    const item = cart.items.find((item) => item.itemId === itemId);
    if (!item) {
        res.status(404);
        throw new Error("Item not found");
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json(cart);
});

// Remove item from cart
const removeCartItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    const itemIndex = cart.items.findIndex(
        (item) => item._id === itemId
    );
    if (itemIndex === -1) {
        res.status(404);
        throw new Error("Item not found");
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    res.status(200).json(cart);
});


module.exports = {
    addToCart,
    getCartItems,
    updateCartItemQuantity,
    removeCartItem,
};
