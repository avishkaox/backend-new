const express = require("express");
const router = express.Router();


const {
    addToCart,
    getCartItems,
    updateCartItemQuantity,
    removeCartItem,
} = require("../controllers/cartController");

const protect = require("../middleWare/authMiddleware");

router.route("/add").post(protect, addToCart);
router.route("/").get(getCartItems);
router.route("/:itemId").put( updateCartItemQuantity).delete(protect, removeCartItem);


module.exports = router;