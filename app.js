const express = require("express");
const cors = require("cors");
require("./config/passport");

const mongoose = require("mongoose");
const createError = require("http-errors");
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
app.use(contactsRouter, authRouter);


app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});
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
