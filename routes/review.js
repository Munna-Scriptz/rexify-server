const express = require("express")
const { createReview } = require("../controllers/reviewController")
const authMiddleware = require("../middleware/authMiddleware")
const router = express.Router()

router.post("/create", authMiddleware, createReview)

module.exports = router