const express = require('express')
const router = express.Router()
const auth = require('./auth')
const category = require('./category')

// ------------ All routes 
router.use('/auth', auth)
router.use('/category', category)

// --------- Not Found 
router.use((req, res) => { res.status(404).send('404 Page Not Found') })

module.exports = router