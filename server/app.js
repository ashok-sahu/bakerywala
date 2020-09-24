const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

//middlewares
app.enable('trust proxy')
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString()
    next()
})

//routes
app.use('/',(req,res)=>{
    res.status(200).json({
        status:'success',
        requestedAt: req.requestTime,
        data: 'hello world',
    })
})
//page not found
app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:'Page Not Found!'
    })
})

module.exports = app