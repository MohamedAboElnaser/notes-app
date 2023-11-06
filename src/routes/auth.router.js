const express = require('express');
const authController = require('./../controllers/auth.controller');
const { validationMiddleWare } = require('../middlewares');

const authRouter = express.Router();
authRouter.use(validationMiddleWare);
authRouter.route('/signup').post(authController.signup);

authRouter.route('/verify-email').post(authController.verifyEmail);

authRouter.route('/login').post(authController.login);

authRouter.route('/reverify-email').post(authController.reverifyEmail)

module.exports = authRouter;
