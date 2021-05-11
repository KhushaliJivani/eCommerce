const express = require("express");
const validate = require("../validation/validation");
const route = express.Router();
const regUserController = require("../controllers/user.controller");
const loginUserController = require("../controllers/auth.controller");
route.post('/userRegister', validate.validateRegUser, regUserController.addUser);
route.post('/login', validate.validateLoginUser, loginUserController.login);
module.exports = route;