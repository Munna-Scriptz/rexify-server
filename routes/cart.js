const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const { createCart, updateCart } = require("../controllers/cartController")
const router = express.Router()

router.post("/create", authMiddleware, createCart)
router.patch("/update", authMiddleware, updateCart)

module.exports = router