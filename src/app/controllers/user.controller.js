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
        })
        const registered = await addUser.save().then(result => {
            var mailOptions={
                from:'khushalijivani31@gmail.com',
                to:req.body.email,
                subject:'Account verification mail',
                text:'hello all are doing good',
                html:'Hello '+req.body.fName+',<br>'+'please verify your account by clicking the link:<br>http://'+req.headers.host+'/confirmation/'+req.body.email+'/'+token+'<br>Thank you!!<br>'
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