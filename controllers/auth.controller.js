// Core Node.js Modules
const path = require("path");
const fs = require("fs/promises");

// NPM Packages
const { v4: uuidV4 } = require("uuid");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// Project-Specific Modules
const User = require("../models/user.model");
const secret = process.env.SECRET;


const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const schema = Joi.object({
  email: Joi.string().required().email({ minDomainSegments: 2 }),
  password: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9]{3,30}$/),
});

const login = async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Email or password is wrong",
    });
  }
  const payload = {
    id: user.id,
    username: user.username,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  user.token = token;
  await user.save();

  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
    message: {
      email: email,
      password: password,
    },
  });
};

const logout = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = req.user;
    user.token = null;
    await user.save();

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email in use",
      data: "Conflict",
    });
  }
  try {
    const avatarURL = gravatar.url(email, { s: 100, protocol: "https" });

    const newUser = new User({ email, avatarURL });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
        user: {
          email: email,
          subscription: "starter",
          avatarURL: avatarURL,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tmpUpload, originalname } = req.file;

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const image = await Jimp.read(tmpUpload);
    await image
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(tmpUpload);

    const filename = `${uuidV4()}-${originalname}`;
    console.log(filename);
    const resultUpload = path.join(avatarsDir, filename);
    console.log(resultUpload);
    await fs.rename(tmpUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    console.log(avatarURL);
    console.log(tmpUpload);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.status(200).json({ avatarURL });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  login,
  logout,
  signup,
  getCurrentUser,
  updateAvatar,
};
