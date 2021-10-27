require("../routes/routes");
const product = require("../models/product.model");
const config = require("../../config/config");
const JWT = require("jsonwebtoken");
const message = require("../../config/message");
exports.displayUserProduct=async(req,res)=>{
    try{
            await product.find({}, function (err, result) {
                if (err) {
                    res.status(400).send({
                        message:message.errorMessage.productNotFound,
                        error: err.message,
                    });
                } else {
                    res.status(200).send({
                        message: message.infoMessage.getDetail,
                        data: result,
                    });
                }
            });
        }catch (error) {
        res.status(400).send({
            message: message.errorMessage.genericError,
            error: error.message,
        });
    }
}
exports.searchUserProduct=async(req,res)=>{
    try{
        await product.find({productName:{'$regex':req.query.search,'$options':'i'}},(err,data)=>{if(err){
            res.status(400).send({message:"No data found",error:err.message});
        }else{
            res.status(200).send({message:message.infoMessage.getDetail,data:data});
        }
    })
}catch(error){
    res.status(400).send({message:message.errorMessage.genericError});
}
}
