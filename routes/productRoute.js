const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  list,
  purchaseProduct,
} = require("../controllers/productController");
const { upload } = require("../utils/fileUpload");

router.post("/", protect, upload.single("image"), createProduct);
router.patch("/:id", protect, upload.single("image"), updateProduct);
router.get("/", getProducts);
router.get("/list", protect, list);
router.get("/:id", protect, getProduct);
router.delete("/:id", protect, deleteProduct);
router.put("/:id/purchase", purchaseProduct);

module.exports = router;

