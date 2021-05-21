require("../routes/routes");
const registerUser=require("../models/user.model");
const pasport=require("passport"); 
const googleStrategy=require("passport-google-oauth2").Strategy;
exports.googleOauth=async(req,res)=>{
    console.log("hello");
}
