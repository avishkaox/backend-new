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
  getProductsForPieChart,
  getAllPurchasedProducts
} = require("../controllers/productController");
const { upload } = require("../utils/fileUpload");

router.post("/", upload.single("image"), createProduct);
router.patch("/:id", upload.single("image"), updateProduct);
router.get("/", getProducts);
router.get("/allpurchasedproducts", getAllPurchasedProducts);
router.get("/productsforpiechart", getProductsForPieChart);
router.get("/list",  list);
router.get("/:id",  getProduct);
router.delete("/:id",  deleteProduct);
router.post("/:id/purchase", purchaseProduct);

module.exports = router;

