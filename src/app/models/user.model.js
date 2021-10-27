const Mongoose = require("mongoose");
const userSchema = new Mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    userRole: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // phoneNo: {
    //     type: Number,
    //     unique: true,
    // },
    password: {
        type: String,
        required: true,
    },
    isActive: {
        type: String,
        enum: [0, 1],
        default: 0
    },
    isSocialLogined: {
        type: String,
        enum: [0, 1],
        default: 0
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordTokenExpire: {
        type: Number,
    },
    resetPasswordToken: {
        type: String
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationTokenExpire: {
        type: Number,
    },
    token: [{
        type: String,
        required: true,
    }]

}, {
    timestamps: true,
})
const Register = new Mongoose.model("registerUser", userSchema);
module.exports = Register;