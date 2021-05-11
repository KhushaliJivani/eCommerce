require("../routes/routes");
var registerUser = require("../models/user.model");
const bcrypt = require("bcryptjs");
exports.addUser = async (req, res) => {
    console.log("hello",req);
    if (!req.body) {
        res.status(400).send({
            message: "content can not be empty",
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
                message: "User is already exist",
            })
        } else {
            let password = req.body.password;
            let confirmPassword = req.body.confirmPassword;
            if (password === confirmPassword) {
                password = await bcrypt.hash(password, 10);
                const addUser = new registerUser({
                    firstName: req.body.fName,
                    lastName: req.body.lName,
                    userRole: req.body.role,
                    email: req.body.email,
                    phoneNo: req.body.phoneNo,
                    password: password,
                })
                const registered = await addUser.save();
                res.status(201).send({
                    message: "register successfully",
                })
            } else {
                res.send({
                    message: "password and confirm password did not match",
                })
            }
        }
    } catch (error) {
        res.status(400).send({
            error: error.message,
        })

    }
}