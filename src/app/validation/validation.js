const joi = require("joi");

exports.validateRegUser = (req, res, next) => {
    const schema = joi.object({
        fName: joi.string().min(3).max(15).required(),
        lName: joi.string().min(3).max(15).required(),
        role: joi.string().required(),
        email: joi.string().email().min(5).max(50).required(),
        phoneNo: joi.number().min(10).required(),
        password: joi.string().min(8).max(15).required(),
        confirmPassword: joi.string().required().valid(joi.ref('password'))
    })
    let result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    next();
}

exports.validateLoginUser = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().min(5).max(30).required(),
        password: joi.string().min(8).max(15).required(),
    })
    let result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    next();
}

exports.validateforgotPassword=(req,res,next)=>{
    const schema=joi.object({
        email: joi.string().email().min(5).max(30).required(),      
    })
    let result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    next();
}

exports.validateChangeforgotPassword=(req,res,next)=>{
    const schema=joi.object({
        password: joi.string().min(8).max(15).required(),
        confirmPassword: joi.string().required().valid(joi.ref('password'))
    })
    let result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    next();
}

exports.validateAddProduct=(req,res,next)=>{
    const schema=joi.object({
        pName:joi.string().min(3).max(15).required(),
        price: joi.number().required(),
        stock:joi.number().required(),
        files:joi.string().required(),
    })
    let result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    next();
}