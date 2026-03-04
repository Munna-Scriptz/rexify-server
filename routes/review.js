const express = require("express")
const { createReview, editReview, deleteReview } = require("../controllers/reviewController")
const authMiddleware = require("../middleware/authMiddleware")
const router = express.Router()

router.post("/create", authMiddleware, createReview)
router.patch("/edit", authMiddleware, editReview)
router.delete("/delete", authMiddleware, deleteReview)

module.exports = router