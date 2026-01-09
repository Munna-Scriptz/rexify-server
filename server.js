const express = require("express")
const cors = require("cors")
const dbConfig = require("./dbConfig")
const router = require("./routes")
const cookieParser = require('cookie-parser')

// ------------------- Uses 
const app = express()
require('dotenv').config()
app.use(express.json())
app.use(cookieParser()) 
app.use(cors())
app.use(router)
dbConfig()

// ----------------------- Server Listener 
app.listen(8000 , ()=>{
    console.log('Server Is Running')
})