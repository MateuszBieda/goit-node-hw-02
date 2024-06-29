const express = require("express");
// const logger = require("morgan");
const cors = require("cors");
// const routerApi = require("./routes/routes/users.routes");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const contactsRouter = require("./routes/routes/contacts.routes");
const authRouter = require("./routes/routes/auth.routes");
const PORT = process.env.PORT || 3000;

const connection = mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.json());
require("./config/passport");
app.use(contactsRouter, authRouter);
// app.use( authRouter);
// app.use(routerApi);

app.use(cors());

connection
  .then(() => {
    console.log("Database connection succesfull");
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Server not running. Error message: [${err.message}]`);
    process.exit(1);
  });

// const contactsRouter = require("./routes/routes/contacts.routes");

// const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// app.use(logger(formatsLogger));
// app.use(cors());
// app.use(express.json());

// app.use("/api/contacts", contactsRouter);
