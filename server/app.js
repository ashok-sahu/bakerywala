const express = require('express')
const cors = require(cors)
const app = express()

//middlewares
app.use(express.urlencoded())
app.use(cors())


module.exports = app