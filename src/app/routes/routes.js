const express = require("express");
const validate = require("../validation/validation");
const validateUser=require("../../utils/email"); 
const route = express.Router();
const regUserController = require("../controllers/user.controller");
const loginUserController = require("../controllers/auth.controller");
route.post('/userRegister', validate.validateRegUser, regUserController.addUser);
route.post('/login', validate.validateLoginUser, loginUserController.login);
route.get('/confirmation/:token',validateUser.confirmMail);//email verification
route.post('/forgotPassword',loginUserController.forgotPassword);
route.get('/resetPasswordConfirmation/:token',validateUser.confirmResetPasswordMail);//mail confirmation for forgot password
route.post('/changeforgotPassword',regUserController.changePassword); // chnage after forgot password
route.post('/resetPassword',loginUserController.resetPassword); //request for reset password
route.get('/changePasswordConfirmation',validateUser.confirmChangePasswordMail) //mail confirmation for reset password
route.post('/changePassword',regUserController.changePassword); // chnage password
module.exports = route;