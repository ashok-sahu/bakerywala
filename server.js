const mongoose = require("mongoose");
const dotenv = require("dotenv");
const chalk = require("chalk");
const morgan = require('morgan')
const app = require("./server/app");

dotenv.config({ path: "./server/config/config.env" });

const PORT = process.env.PORT || 5000;
// const LOCAL_DB = process.env.DB;
const SERVER_DB = process.env.DATABASE;

mongoose
  .connect(SERVER_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(chalk.bgMagenta.black(`database connected successfully!`));
  })
  .catch(() => {
    console.log(chalk.red(`database connection failed!`));
  });

app.use(cors());
app.options("*", cors());
// app.use(morgan('dev'))

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

app.listen(PORT, () => {
  console.log(
    chalk.bgGray.white(`server is running on port http://localhost:${PORT}`)
  );
});
