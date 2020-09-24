const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

//routings
const authRoute = require("./routes/UserAuthRoutes");

//middlewares
app.enable("trust proxy");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.options("*", cors());
// app.use(morgan('dev'))
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//config for development
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );

  app.use(morgan("dev"));
  //morgan gives information about each request
  //cors it's allow to deal with react for localhost at port 3000 without any problem
}

//routers
app.use("/api", authRoute);

//routes
app.use("/", (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: "hello world",
  });
});
//page not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found!",
  });
});

module.exports = app;
