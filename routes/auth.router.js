const express = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = express.Router();
authRouter.route("/signup").post(authController.signup);

authRouter.route('/verify-email').post(authController.verifyEmail);

module.exports = authRouter;
