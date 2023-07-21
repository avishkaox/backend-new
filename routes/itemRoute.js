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
    getItemsforbarchart,
} = require("../controllers/itemController");

router.post("/",  createItem);
router.patch("/:id", updateItem);
router.get("/", getItems);
router.get("/getitemsforbarchart", getItemsforbarchart);
router.get("/list", listItem);
router.get("/:id", getItem);
router.delete("/:id", deleteItem);

module.exports = router;
