const express = require("express");
const validate = require("../validation/validation");
const validateUser = require("../../utils/email");
const auth = require('../validation/JWTvalidation');
const route = express.Router();
const {upload} = require('../../utils/uploadfile');
const regUserController = require("../controllers/user.controller");
const loginUserController = require("../controllers/auth.controller");
const productAdd = require("../controllers/addproduct.controller");
const userProfile = require("../controllers/userProfile.controller");
const cart=require("../controllers/sellProduct.controller");
const order=require("../controllers/orderProduct.controller");
const userProduct=require("../controllers/userProduct.controller");

//user authentication
route.post('/userRegister', validate.validateRegUser, regUserController.addUser);
route.post('/login', validate.validateLoginUser, loginUserController.login);
route.get('/confirmation/:token/:email', validateUser.confirmMail); //email verification
route.post('/resend', regUserController.resendLink);
route.post('/forgotPassword', validate.validateforgotPassword, loginUserController.forgotPassword);
route.get('/resetPasswordConfirmation/:token', validateUser.confirmResetPasswordMail); //mail confirmation for forgot password
route.post('/changeForgotPassword', validate.validateChangeforgotPassword, regUserController.changePassword); // chnage after forgot password
route.post('/resetPassword', validate.validateforgotPassword, loginUserController.resetPassword); //request for reset password
route.get('/changePasswordConfirmation/:token', validateUser.confirmChangePasswordMail) //mail confirmation for reset password
route.post('/changePassword', validate.validateChangeforgotPassword, regUserController.changePassword); // chnage password
route.get('/logout/:email/:token', auth.jwtvalidation, regUserController.logout); //logput API front no need to store token in database.
route.post('/google', regUserController.googleLogin);

//product
route.post('/addProduct',auth.jwtvalidation,upload.array('files'), productAdd.addProduct);
route.post('/displayProduct', auth.jwtvalidation, productAdd.displayProduct); //display product API
route.post('/editProduct', auth.jwtvalidation, productAdd.editProduct); // edit product API
route.post('/editAddProduct', auth.jwtvalidation, upload.array('files'), productAdd.editAddProduct); // add after edit Product API
route.post('/deleteProduct', auth.jwtvalidation, productAdd.deleteProduct); //delete product API
route.post('/userProfile', userProfile.userProfile); //display user profile
route.post('/editUserProfile', userProfile.editUserProfile); //edit user profile
route.post('/addToCart/:id',cart.addToCart);
route.post('/editCart/:id',cart.editCart);
route.get('/search',productAdd.searchProduct);
route.post('/deleteCart/:id',cart.deleteCart);
route.post('/orderProducts',order.orderProducts);
route.post('/history',order.history);
route.post('/displayUserProduct',userProduct.displayUserProduct);
route.get('/searchProducts',userProduct.searchUserProduct);

route.get('/payment',order.payment);
route.post('/paymentExtra',order.paymentExtra);
module.exports = route;