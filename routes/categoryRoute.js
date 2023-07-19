const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const {
  create,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

router.post("/create", protect, create);
router.get("/", getAllCategories);
router.get("/:id", protect, getCategory);
router.patch("/:id", protect,  updateCategory);
router.delete("/:id", protect,  deleteCategory);

module.exports = router;
