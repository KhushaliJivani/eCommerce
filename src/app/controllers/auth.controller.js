require("../routes/routes");
const bcrypt = require("bcryptjs");
const configJWT = require("../../config/config");
const jwt = require("jsonwebtoken");
const registerUser = require("../models/user.model");
const mail=require("../../utils/email");
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
        const storeToken=await registerUser.updateOne({email:req.body.email},{$push:{token:token}});
        if(!userLogin){
            res.status(401).send({message:"email address is not associate with the account"})
        }else if (!isMatch) {
            res.status(401).send({
                message: "wrong password",
                token: token,
            })
        }else if(regUserData.isActive==0){
            res.status(401).send({message:"your email is not verified"})
        } else {
            res.status(200).send({
                message: "Login Successfull",
            })
        }
    } catch (error) {
        res.status(400).send({message:"invalid login"});
    }
}
exports.forgotPassword=async(req,res)=>{
    const email=req.body.email;
    const forgotPasswordUser=await registerUser.findOne({email:email});
        if(!forgotPasswordUser){
            res.status(401).send({
                message:"no user found with this email address"
            })
        }else{
            const token=Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2, 15);
            const storeToken=await registerUser.updateOne({_id:forgotPasswordUser._id},{$set:{forgotPasswordToken:token}});
            let mailOptions={
                from:'khushalijivani31@gmail.com',
                to:req.body.email,
                subject:'resetpassword verification mail',
               // html:'Hello , <br> please verify your account by clicking the link:<br>http://'+req.headers.host+'/resetPasswordConfirmation/'+req.body.email+'/'+token+'<br>Thank you!!<br>'
                html:'Hello , <br> please verify your account by clicking the link:<br>http://3000/resetPassword/'+token+'<br>Thank you!!<br>'

            }
            mail.email(mailOptions,(err,data)=>{
                if(err){
                    res.status(401).send({
                        message:"user not fund",
                        data:[],
                        error:err
                    });
                }else{
                    res.send({
                        code: 200,
                        message:"email send",
                        data: data,
                        token: token,
                        error: []
                });
                }
            });               
  }
}
exports.resetPassword=async(req,res)=>{
    const email=req.body.email;
    const resetPasswordUser=await registerUser.findOne({email:email});
        if(!resetPasswordUser){
            res.status(401).send({
                message:"no user found with this email address"
            })
        }else{
            const token=Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2, 15);
            const storeToken=await registerUser.updateOne({_id:resetPasswordUser._id},{$set:{resetPasswordToken:token}});
            let mailOptions={
                from:'khushalijivani31@gmail.com',
                to:req.body.email,
                subject:'Change password verification mail',
                html:'Hello , <br> please verify your account by clicking the link:<br>http://3000/resetPassword/'+token+'<br>Thank you!!<br>'
            }
            mail.email(mailOptions,(err,data)=>{
                if(err){
                    res.status(401).send({
                        message:"user not fund",
                        data:[],
                        error:err
                    });
                }else{
                    res.send({
                        code: 200,
                        message:"email send",
                        data: data,
                        token: token,
                        error: []
                });
                }
            });               
  }
}
