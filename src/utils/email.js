const nodemailer=require("nodemailer");
var registerUser = require("../app/models/user.model");
exports.email=(params,callback)=>{
    try{
        const transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'khushalijivani31@gmail.com',
                pass:'khushali@31'

            }

        });
        transporter.sendMail(params,function(error,info){
            if(error) callback(error, []);
            if(info) callback(undefined, info);
        })
    }catch(err){
        console.log(err);
    }
}
exports.confirmMail=async function(req,res,next){
    const token=req.params.token;
    const validateUser=registerUser.findOne({emailVerificationToken:token},function(err,token){
        if(!token){
            return res.status(400).send({
                message:"link expire",
            })
        }else{
            const user=registerUser.findOne({email:req.params.email},function(err,user){
                if(!user){
                    return res.status(401).send({
                        message:"User is not available for this verification.Please SignUP!! "
                    });
                }else{
                    const updated=registerUser.updateOne({
                        _id: user._id
                    }, {
                        $set: {
                            isActive:1
                        }
                    },function(err){
                        if(err){
                            return res.status(500).send({
                                message:err.message
                            })
                        }else{
                            return res.status(200).send("your account has been successfully verified");
                        }
                    });
                }
            });

        }
    });
}
exports.confirmResetPasswordMail=async function(req,res){
    const token=req.params.token;
    const validateUser=registerUser.findOne({forgotPasswordToken:token},function(err,token){
        if(!token){
            return res.status(400).send({
                message:"link expire",
            })
        }else{
            res.status(200).send({
                name:validateUser.fname,
                message:'password reset link is ok',
                data:validateUser.email
            })
        }      
})
}
exports.confirmChangePasswordMail=async function(req,res){
    const token=req.params.token;
    const validateUser=registerUser.findOne({resetPasswordToken:token},function(err,token){
        if(!token){
            return res.status(400).send({
                message:"link expire",
            })
        }else{
            res.status(200).send({
                name:validateUser.email,
                message:'password reset link is ok'
            })
        }      
})
}

