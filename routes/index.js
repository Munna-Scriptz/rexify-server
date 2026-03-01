const express = require('express')
const router = express.Router()
const auth = require('./auth')
const category = require('./category')
const product = require('./product')
const review = require('./review')

// ------------ All routes 
router.use('/auth', auth)
router.use('/category', category)
router.use('/product', product)
router.use('/review', review)


// --------- Not Found 
router.use((req, res) => { res.status(404).send('404 Page Not Found') })

module.exports = router