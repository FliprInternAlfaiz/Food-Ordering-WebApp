const express = require('express');
const { getCartByEmail, addToCart, deleteCart, updateCart, getSingleCart } = require('../controllers/cartControllers');
const router = express.Router();
const verifytoken = require("../middleware/verifyToken")

router.get("/",verifytoken,getCartByEmail)
router.post("/",addToCart)
router.delete("/:id",deleteCart)
router.put("/:id",updateCart)
router.put("/:id",getSingleCart)

module.exports = router;