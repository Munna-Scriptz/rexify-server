const express = require('express')
const router = express.Router()
const { createProduct } = require("../controllers/productController")
const authMiddleware = require('../middleware/authMiddleware')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')
const multer = require('multer')
const upload = multer()


router.post('/create', authMiddleware, roleCheckMiddleware("admin", "editor"), upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 4 }]), createProduct)

module.exports = router