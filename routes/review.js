const express = require("express")
const { createReview, editReview } = require("../controllers/reviewController")
const authMiddleware = require("../middleware/authMiddleware")
const router = express.Router()

router.post("/create", authMiddleware, createReview)
router.patch("/edit", authMiddleware, editReview)

module.exports = router