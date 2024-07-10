const express = require("express");
const cors = require("cors");
// const path = require("path");
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

app.use(express.static("public"));
app.use("/avatars", express.static("avatars"));

// const fs = require("fs").promises;
const path = require("path");
const multer = require("multer");

const tempDir = path.join(process.cwd(), "tmp");
const storeImageDir = path.join(process.cwd(), "public/avatars");

console.log(tempDir);
console.log(storeImageDir);

// const destination = path.resolve("temp");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const extentionsWhiteList = [".jpg", ".jpeg", ".png", ".gif"];
const mimetypeWhiteList = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

const uploadMiddleware = multer({
  storage,
  fileFilter: async (req, file, cb) => {
    const extention = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (
      !extentionsWhiteList.includes(extention) ||
      !mimetypeWhiteList.includes(mimetype)
    ) {
      return cb(null, false);
    }
    return cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 * 20 },
});

app.put("/avatars", uploadMiddleware.single("avatar"));

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
