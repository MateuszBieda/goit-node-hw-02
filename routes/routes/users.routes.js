const express = require("express");
const User = require("../../user");
const router = express.Router;

// const usersController = require("../../controllers/users.controller");

router.post("/users/signup", async (req, res, next) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email }).lean();
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const newUser = new User({ email });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      status: "sucess",
      code: 201,
      data: {
        message: "Registration successful",
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
