const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const { createCart } = require("../controllers/cartController")
const router = express.Router()

router.post("/create", authMiddleware, createCart)

module.exports = router