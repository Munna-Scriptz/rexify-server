const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const { createCart, updateCart, deleteCart } = require("../controllers/cartController")
const router = express.Router()

router.post("/create", authMiddleware, createCart)
router.patch("/update", authMiddleware, updateCart)
router.delete("/delete", authMiddleware, deleteCart)

module.exports = router