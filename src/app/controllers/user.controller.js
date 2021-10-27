const JWT = require('jsonwebToken');
require("../routes/routes");
const registerUser = require("../models/user.model");
const message = require("../../config/message");
const dotenv = require("dotenv").config();
const configJWT = require("../../config/config");
const {OAuth2Client} = require('google-auth-library');
const jwt = require("jsonwebtoken");
const mail = require("../../utils/email");
const bcrypt = require("bcryptjs");
exports.addUser = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: message.errorMessage.contentNotBeEmpty,
        })
        return;
    }
    try {
        email = req.body.email;
        let registeredUser = await registerUser.findOne({
            email
        });
        if (registeredUser) {
            res.status(409).send({
                message: message.errorMessage.emailExist,
            })
        } else {
            signUpProcess(req, res);
        }
    } catch (error) {
        res.status(400).send({
            error: error.message,
        })

    }
}
const signUpProcess = async (req, res) => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    if (password === confirmPassword) {
        password = await bcrypt.hash(password, 10);
        const addUser = new registerUser({
            firstName: req.body.fName,
            lastName: req.body.lName,
            userRole: req.body.role,
            email: req.body.email,
            //phoneNo: req.body.phoneNo,
            password: password,
            emailVerificationToken: token,
            emailVerificationTokenExpire: Date.now() + 360000,
        })
        const registered = await addUser.save().then(result => {
            var mailOptions = {
                from: 'khushalijivani31@gmail.com',
                to: req.body.email,
                subject: 'Account verification mail',
                text: 'hello all are doing good',
                html: 'Hello ' + req.body.fName + ',<br>' + 'please verify your account by clicking the link:<br>http://localhost:3000/login/' + token + '<br>Thank you!!<br>'
            };
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
            })
        }).catch((err) => {
            res.status(401).send({
                message: message.errorMessage.tokenNotFound,
                data: [],
                error: err
            });
        });
    } else {
        res.status(400).send({
            message: message.errorMessage.passwordConfirmPasswordNotMatch,
        })
    }
}

exports.changePassword = async (req, res) => {
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    if (password === confirmPassword) {
        const findUser = registerUser.findOne({
            email: req.body.email
        });
        if (findUser) {
            const hashPassword = await bcrypt.hash(password, 10);
            const updatePassword = await registerUser.updateOne({
                email: req.body.email
            }, {
                $set: {
                    password: hashPassword
                }
            });
            res.status(200).send({
                message: message.infoMessage.updateDetails
            });
        } else {
            res.status(404).send({
                message: message.errorMessage.emailNotFound
            })

        }

    }
}
exports.resendLink = async (req, res) => {
    registerUser.findOne({
        email: req.body.email
    }, function (err, user) {
        if (!user) {
            res.status(400).send({
                message: message.errorMessage.emailNotFound,
            })
        } else if (user.isActive == 1) {
            res.status(200).send({
                message: message.errorMessage.accountverified
            });
        } else {
            const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const storeToken = registerUser.updateOne({
                _id: user._id
            }, {
                $set: {
                    emailVerificationToken: token,
                    emailVerificationTokenExpire: Date.now() + 360000
                }
            });
            console.log(storeToken);
            let mailOptions = {
                from: 'khushalijivani31@gmail.com',
                to: req.body.email,
                subject: 'Account verification mail',
                html: 'Hello ' + req.body.fName + ',<br>' + 'please verify your account by clicking the link:<br>http://localhost:3000/login/' + token + '<br>Thank you!!<br>'

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

                        message: message.errorMessage.emailNotFound,
                        data: data,
                        token: token,
                        error: []
                    });
                }
            });
        }
    })
}

exports.googleLogin = async (req, res) => {
    try {

        const token = req.body.token;
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const verifyToken = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const {
            name,
            email
        } = verifyToken.getPayload();
        //    console.log(name);
        const firstName = name.substr(0, name.indexOf(" "));
        const lastName = name.substr(name.indexOf(" ") + 1);
        const user = await registerUser.findOne({
            email
        });
        //check email for existance or issociallogined1 then only generate a token
        if (user) {
            var payload = {
                _id: user._id.toString(),
                email: user.email,
            }
            const token = jwt.sign(payload, configJWT.JWTSecret, {
                expiresIn: '1d' //30000
            });
            const storeToken = registerUser.updateOne({
                email: user.email
            }, {
                $push: {
                    token: token
                }
            });
            console.log(storeToken);
            res.status(400).send({
                message: message.errorMessage.emailExist,
                data: user,
                token: token
            });
        } else {
            const addUser = new registerUser({
                firstName: firstName,
                lastName: lastName,
                userRole: req.body.role,
                email: email,
                isSocialLogined: 1,
                isActive: 1,
                password: "null",
            })
            await addUser.save().then(result => {
                var payload = {
                    _id: result._id.toString(),
                    email: result.email,
                }
                const token = jwt.sign(payload, configJWT.JWTSecret, {
                    expiresIn: '1d' //30000
                });
                const storeToken = registerUser.updateOne({
                    email: result.email
                }, {
                    $push: {
                        token: token
                    }
                }, function (err, data) {
                    if (err) {
                        res.status(400).send({
                            message: message.errorMessage.dataNotUpdated
                        });
                    } else {
                        res.status(200).send({
                            message: message.infoMessage.registerSuccess,
                            data: result,
                            token: token
                        })
                    }
                });

            }).catch((err) => {
                res.status(400).send({
                    message: message.errorMessage.tokenNotFound,
                    error: err
                });
            })
        }
    } catch (err) {
        res.status(400).send({
            message: message.errorMessage.genericError,
            error: err
        });
    }

}

exports.logout = async (req, res) => {
    let email = req.params.email;
    let token = req.params.token;
    const user = await registerUser.findOne({
        email: email
    });
    if (user) {
        const destroyToken = await registerUser.updateOne({
            email: req.body.email
        }, {
            $pull: {
                token: token
            }
        });
        res.status(200).send({
            message: message.infoMessage.logoutSuccess
        });
    } else {
        res.send(401).status({
            message: message.errorMessage.emailNotFound,
        })
    }


}