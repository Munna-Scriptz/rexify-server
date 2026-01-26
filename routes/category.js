const express = require('express')
const multer = require('multer')
const upload = multer()
const { createCategory } = require('../controllers/categoryController')
const router = express.Router()

router.post("/create", upload.single('thumbnail'), createCategory)

module.exports = router