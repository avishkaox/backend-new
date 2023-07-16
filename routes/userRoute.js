const express = require('express');
const {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    updatePassword,
    forgotPassword,
    resetPassword,
    updateUserById,
    getAllUsers
} = require('../controllers/userController.js');
const protect = require('../middleWare/authMiddleware.js');
const router = express.Router();
const { upload } = require("../utils/fileUpload");


router.post("/register", upload.single("image"),  registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser", protect, getUser);
router.get("/getallUser", getAllUsers);
router.get("/loggedin", loginStatus);
router.patch("/updateuser", protect, updateUser);
router.patch("/updateuser/:id", updateUserById);
router.patch("/updatpassword", protect, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

module.exports = router;