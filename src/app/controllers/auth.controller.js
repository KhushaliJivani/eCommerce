require("../routes/routes");
const bcrypt = require("bcryptjs");
const configJWT = require("G:/Task/React_Node_application/src/config/config");
const jwt = require("jsonwebtoken");
const registerUser = require("../models/user.model");
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
            expiresIn: 30000
        });
        // const inserToken=await registerUser.insertOne({
        //     token:token
        // })
        //regUserData.tokens=regUserData.tokens.concat({token:token});
        //await registerUser.save();
        if (isMatch) {
            res.status(200).send({
                message: "login successfull",
                token: token,
            })
        } else {
            res.status(401).send({
                message: "invalid login",
            })
        }
    } catch (error) {
        res.status(400).send("invalid login");
    }
}