const express = require("express");
const router = express.Router();

const authController = require("../../controllers/auth.controller");
const auth = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");

router.post("/users/login", authController.login);
router.post("/users/signup", authController.signup);
router.get("/users/logout", auth, authController.logout);
router.get("/users/current", auth, authController.getCurrentUser);
router.patch(
  "/users/avatars",
  auth,
  upload.single("avatar"),
  authController.updateAvatar
);

module.exports = router;
