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

router.post("/create", create);
router.get("/", getAllCategories);
router.get("/:id", getCategory);
router.patch("/:id",  updateCategory);
router.delete("/:id",  deleteCategory);

module.exports = router;
