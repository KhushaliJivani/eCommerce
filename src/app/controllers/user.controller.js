const JWT=require('jsonwebToken');
require("../routes/routes");
var registerUser = require("../models/user.model");
var mail=require("../../utils/email");
const bcrypt = require("bcryptjs");
exports.addUser = async (req, res) => {
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
           signUpProcess(req,res);
        }
    } catch (error) {
        res.status(400).send({
            error: error.message,
        })

    }
}
const signUpProcess=async(req,res)=>{
    const token=Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
            emailVerificationToken:token,
            emailVerificationTokenExpire:Date.now()+360000,
        })
        const registered = await addUser.save().then(result => {
            var mailOptions={
                from:'khushalijivani31@gmail.com',
                to:req.body.email,
                subject:'Account verification mail',
                text:'hello all are doing good',
                html:'Hello '+req.body.fName+',<br>'+'please verify your account by clicking the link:<br>http://localhost:3000/login/'+token+'<br>Thank you!!<br>'
            };
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
        })  
    }).catch((err) => {
        res.send({
            code: 401,
            message: 'token Not Found',
            data: [],
            error: err
        });
     });
    }else {
        res.send({
            message: "password and confirm password did not match",
        })
    }
}

exports.changePassword=async(req,res)=>{
    let password=req.body.password;
    let confirmPassword=req.body.confirmPassword;
    if(password===confirmPassword){
        const findUser=registerUser.findOne({email:req.body.email
        });
        if(findUser){
            const hashPassword=await bcrypt.hash(password,10);
            const updatePassword=await registerUser.updateOne({email:req.body.email},{$set:{password:hashPassword}});
            res.status(200).send({message:"password updated"})
        }
        else{
            res.status(404).send({message:"no user is exist with this email" })

        }
        
    }
}
exports.resendLink=async(req,res)=>{
    registerUser.findOne({email:req.body.email},function(err,user){
        if(!user){
            res.status(400).send({
                message:"no user found enter a correct email",
            })
        }else if(user.isActive==1){
            res.status(200).send({message:"account is already verified please log in"});
        }else{
            const token=Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const storeToken=registerUser.updateOne({_id:user._id},{$set:{emailVerificationToken:token,emailVerificationTokenExpire:Date.now()+360000}});
            console.log(storeToken);
            let mailOptions={
                from:'khushalijivani31@gmail.com',
                to:req.body.email,
                subject:'Account verification mail',
                html:'Hello '+req.body.fName+',<br>'+'please verify your account by clicking the link:<br>http://localhost:3000/login/'+token+'<br>Thank you!!<br>'

            }
            mail.email(mailOptions,(err,data)=>{
                if(err){
                    res.status(401).send({
                        message:"user not fund",
                        data:[],
                        error:err
                    });
                }else{
                    res.status(200).send({
                        
                        message:"email send",
                        data: data,
                        token: token,
                        error: []
                });
                }
            });  
        }
    })
}


exports.logout=async(req,res)=>{
    let email=req.params.email;
    let token=req.params.token;
    const user=await registerUser.findOne({email:email});
    if(user){
        const destroyToken=await registerUser.updateOne({email:req.body.email},{$pull:{token:token}});
        res.status(200).send({message:"logout successfully"});   
    }else{
        res.send(401).status({
            message:"no user found"
        })
    }


}
