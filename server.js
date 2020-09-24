const mongoose = require("mongoose");
const dotenv = require("dotenv");
const chalk = require("chalk");
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

app.listen(PORT, () => {
  console.log(
    chalk.bgGray.white(`server is running on port http://localhost:${PORT}`)
  );
});
