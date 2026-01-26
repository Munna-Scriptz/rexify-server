const express = require('express')
const { createCategory } = require('../controllers/categoryController')
const router = express.Router()

router.get("/create", createCategory)

module.exports = router