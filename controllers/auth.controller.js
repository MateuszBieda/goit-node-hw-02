const User = require("../models/user.model");
const gravatar = require("gravatar");
// const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const Joi = require("joi");



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
    // const getGravatarUrl = (email, size = 80) => {
    //   const trimmedEmail = email.trim().toLowerCase();
    //   const hash = crypto
    //     .createHash("sha256")
    //     .update(trimmedEmail)
    //     .digest("hex");
    //   return `https://www.gravatar.com/avatars/${hash}?s=${size}&d=identicon`;
    // };

    // const size = 250; // Optional size parameter
    // const avatarURL = getGravatarUrl(email, size);
    const avatarURL = gravatar.url(email);
    console.log(avatarURL);
    const newUser = new User({ email });
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

module.exports = {
  login,
  logout,
  signup,
  getCurrentUser,
};
