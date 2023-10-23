const express = require("express");
const authController=require('../controllers/auth.controller');


const authRouter = express.Router();
authRouter.route('/signup').get(authController.signup);

module.exports = authRouter;
