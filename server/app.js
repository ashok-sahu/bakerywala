const express = require('express')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const app = express()

//routes
const userAuthRoute = require('./routes/UserAuthRoutes')

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//middlewares
app.enable("trust proxy");
app.use(express.json())
app.use(cors())
app.options("*", cors());
app.use(express.static(`${__dirname}/public`));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/public", "index.html"));
});

//routing
app.use('/api',userAuthRoute)



module.exports = app