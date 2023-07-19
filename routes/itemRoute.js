const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const {
    createItem,
    getItems,
    getItem,
    deleteItem,
    updateItem,
    listItem,
} = require("../controllers/itemController");

router.post("/", protect,  createItem);
router.patch("/:id", protect, updateItem);
router.get("/", getItems);
router.get("/list", protect, listItem);
router.get("/:id", protect, getItem);
router.delete("/:id", protect, deleteItem);

module.exports = router;
