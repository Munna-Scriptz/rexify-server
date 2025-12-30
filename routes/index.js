const express = require('express')
const router = express.Router()
const authRouter = require('./authRouter')
const productRouter = require('./productsRouter')

router.use('/auth', authRouter)
router.use('/products', productRouter)

// --------- Not Found 
router.use((req, res) => { res.status(404).send('404 Page Not Found') })

module.exports = router