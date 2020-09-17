const express = require('express')
const cors = require('cors')
const app = express()

//routes
const userAuthRoute = require('./routes/UserAuthRoutes')

//middlewares
app.enable("trust proxy");
app.use(express.json())
app.use(cors())
app.options("*", cors());

//routing
app.use('/api',userAuthRoute)



module.exports = app