const express = require("express");
const router = express.Router();

const authController = require("../../controllers/auth.controller");
const auth = require("../../middlewares/auth");
router.post("/users/login", authController.login);
router.post("/users/signup", authController.signup);
router.get("/users/logout", auth, authController.logout);
router.get("/users/current", auth, authController.getCurrentUser);
// router.get("/avatars/:imgPath", (req,res)=>{
//     const {imgPath} = req.params;
// })
// router.patch("/users/avatars", auth, authController.getCurrentUser);
module.exports = router;
