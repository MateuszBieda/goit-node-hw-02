const express = require("express");
const createError = require("http-errors");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const contactsRouter = require("./routes/routes/contacts.routes");

const PORT = process.env.PORT || 3000;

const connection = mongoose.connect(process.env.DATABASE_URL);
app.use(express.json());

app.use(contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// app.use(routerApi);

app.use(cors());
app.use((req, res, next) => {
  next(createError(404));
});

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
