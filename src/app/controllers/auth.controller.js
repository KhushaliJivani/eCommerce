require("../routes/routes");
const bcrypt = require("bcryptjs");
const configJWT = require("../../config/config");
const jwt = require("jsonwebtoken");
const registerUser = require("../models/user.model");
const mail = require("../../utils/email");
const message = require("../../config/message");
exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userLogin = await registerUser.findOne({
            email: email
        });
        const regUserData = await registerUser.findOne({
            _id: userLogin._id
        });

        const isMatch = await bcrypt.compare(password, userLogin.password);
        var payload = {
            _id: regUserData._id.toString(),
            email: regUserData.email,
        }
        const token = jwt.sign(payload, configJWT.JWTSecret, {
            expiresIn: '1d' //30000
        });
        const storeToken = await registerUser.updateOne({
            email: req.body.email
        }, {
            $push: {
                token: token
            }
        });
        if (!userLogin) {
            res.status(401).send({
                message: message.errorMessage.emailNotFound
            })
        } else if (!isMatch) {
            res.status(401).send({
                message: message.errorMessage.passwrdWrong,
                token: token,
            })
        } else if (regUserData.isActive == 0) {
            res.status(401).send({
                message: message.errorMessage.accountNotActivated
            })
        } else {
            res.status(200).send({
                message: message.infoMessage.loginSuccess,
                token: token,
            })
        }
    } catch (error) {
        res.status(400).send({
            message: message.errorMessage.invalidLogin
        });
    }
}
exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
    const forgotPasswordUser = await registerUser.findOne({
        email: email
    });
    if (!forgotPasswordUser) {
        res.status(401).send({
            message: message.errorMessage.emailNotFound,
        })
    } else {
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const storeToken = await registerUser.updateOne({
            _id: forgotPasswordUser._id
        }, {
            $set: {
                forgotPasswordToken: token,
                forgotPasswordTokenExpire: Date.now() + 360000
            }
        });
        let mailOptions = {
            from: 'khushalijivani31@gmail.com',
            to: req.body.email,
            subject: 'resetpassword verification mail',
            html: 'Hello , <br> please verify your account by clicking the link:<br>http://localhost:3000/resetPassword/' + token + '<br>Thank you!!<br>'

        }
        mail.email(mailOptions, (err, data) => {
            if (err) {
                res.status(401).send({
                    message: message.errorMessage.emailNotFound,
                    data: [],
                    error: err
                });
            } else {
                res.status(200).send({

                    message: message.infoMessage.emailSend,
                    data: data,
                    token: token,
                    error: []
                });
            }
        });
    }
}
exports.resetPassword = async (req, res) => {
    const email = req.body.email;
    const resetPasswordUser = await registerUser.findOne({
        email: email
    });
    if (!resetPasswordUser) {
        res.status(401).send({
            message: message.errorMessage.emailNotFound,
        })
    } else {
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const storeToken = await registerUser.updateOne({
            _id: resetPasswordUser._id
        }, {
            $set: {
                resetPasswordToken: token
            }
        });
        let mailOptions = {
            from: 'khushalijivani31@gmail.com',
            to: req.body.email,
            subject: 'Change password verification mail',
            html: 'Hello , <br> please verify your account by clicking the link:<br>http://localhost:3000/resetPassword/' + token + '<br>Thank you!!<br>'
        }
        mail.email(mailOptions, (err, data) => {
            if (err) {
                res.status(401).send({
                    message: message.errorMessage.emailNotFound,
                    data: [],
                    error: err
                });
            } else {
                res.status(200).send({
                    message: message.errorMessage.emailSend,
                    data: data,
                    token: token,
                    error: []
                });
            }
        });
    }
}

respected ma'am,
    I want to apologize for this.I am sorry ma'am till now i had reported after 9:45 it's my mistake but now onwards i will be on time and i'll also make sure that this mistake will not happen again.
Thanks and regards.