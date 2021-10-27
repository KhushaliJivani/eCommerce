require("../routes/routes");
const registerUser = require("../models/user.model");
const message = require("../../config/message");
exports.userProfile = async (req, res) => {
    try {
        const email = req.body.email;
        await registerUser.findOne({
            email: email
        }, function (err, result) {
            if (err) {
                res.status(400).send({
                    message: message.errorMessage.userNotFound,
                    error: err
                });
            } else {
                res.status(200).send({
                    message: message.infoMessage.getDetail,
                    data: result
                });
            }
        })
    } catch (err) {
        res.status(400).send({
            message: message.errorMessage.genericError,
            error: err
        })
    }
}
exports.editUserProfile = async (req, res) => {
    try {
        const oldEmail = req.body.email;
        await registerUser.findOne({
            email: email
        }, function (err, result) {
            if (err) {
                res.status(400).send({
                    message: message.errorMessage.userNotFound,
                    error: err.message,
                });
            } else {
                const email = req.body.email;
                const fName = req.body.fName;
                const lName = req.body.lName;
                const phoneNo = req.body.phoneNo;
                const updatedUser = registerUser.updateOne({
                    email: oldEmail
                }, {
                    $set: {
                        firstName: fName,
                        lastName: lName,
                        phoneNo: phoneNo
                    }
                });
                console.log(updatedUser);
                res.status(200).send({
                    message: message.infoMessage.updateDetails,
                    data: result
                });
            }
        })
    } catch (err) {
        res.status(400).send({
            message: message.errorMessage.genericError,
            error: err.message,
        })
    }
}