require("../routes/routes");
const product = require("../models/product.model");
const registerUser = require("../models/user.model");
const login = require("./auth.controller");
const config = require("../../config/config");
const uploadImage = require("../../utils/uploadfile");
const JWT = require("jsonwebtoken");
const message = require("../../config/message");
exports.addProduct = async (req, res) => {
    try {
        const email = req.body.email;
        const role = req.body.role;
        const file = req.files;
        const price = req.body.price;
        const stock = req.body.stock;
        if (role === "vendor") {
            const user = await registerUser.findOne({
                email: email
            });
            if (!user) {
                res.status(400).send({
                    message: message.errorMessage.emailNotFound
                })
            } else {
                const token = (req.headers['authorization']).substr(7);
                const decode = JWT.verify(token, config.JWTSecret);
                const file = req.files;
                const addProduct = new product({
                    userId: decode._id,
                    productName: req.body.pName,
                    productPrice: req.body.price,
                    stock: req.body.stock,
                })
                const productList = await addProduct.save();
                for (var i = 0; i < file.length; i++) {
                    const data = await product.updateOne({
                        _id: productList._id
                    }, {
                        $push: {
                            productImage: file[i].path
                        }
                    });
                }
                res.status(200).send({
                    message: message.infoMessage.saveDetail
                });
            }
        } else {
            res.status(400).send({
                message: message.errorMessage.wrongUser
            });
        }
    } catch (error) {
        res.status(400).send({
            message: message.errorMessage.genericError,
            error: error.message,
        })
    }
}
exports.editProduct = async (req, res) => {
    try {
        const role = req.body.role;
        if (role === "vendor") {
            const productId = req.body.id;
            await product.findOne({
                _id: productId
            }, function (err, result) {
                if (err) {
                    res.status(400).send({
                        message: "error",
                        error: err
                    });
                } else {
                    res.status(200).send({
                        message: "product detail",
                        data: result
                    });
                }
            })
        } else {
            res.status(400).send({
                message: message.errorMessage.wrongUser
            });
        }
    } catch (error) {
        res.status(400).send({
            message: message.errorMessage.genericError,
            error: err.message,
        })
    }
}
exports.editAddProduct = async (req, res) => {
    try {
        const role = req.body.role;
        const file = req.files;
        if (role === "vendor") {
            const productId = req.body.id;
            const updateProduct = await product.updateOne({
                _id: productId
            }, {
                $set: {
                    productName: req.body.pName,
                    productPrice: req.body.price,
                    stock: req.body.stock,
                }
            });
            for (var i = 0; i < file.length; i++) {
                const data = await product.updateOne({
                    _id: productId
                }, {
                    $push: {
                        productImage: file[i].path
                    }
                });
            }
            const findProduct = await product.findOne({
                _id: productId
            });
            res.status(200).send({
                message: message.infoMessage.updateDetails,
                data: findProduct
            });
        } else {
            res.status(400).send({
                message: message.errorMessage.wrongUser,

            })
        }
    } catch (error) {
        res.status(400).send({
            message: message.errorMessage.dataNotUpdated,
            error: error.message
        });
    }
}
exports.deleteProduct = async (req, res) => {
    try {
        const role = req.body.role;
        if (role === "vendor") {
            const productId = req.body.id;
            await product.deleteOne({
                _id: productId
            }, function (err, result) {
                if (err) {
                    res.status(400).send({
                        message: "error",
                        error: err
                    });
                } else {
                    res.status(200).send({
                        message: message.infoMessage.deleteDetails,
                        data: result
                    });
                }
            })
        } else {
            res.status(400).send({
                message: message.errorMessage.wrongUser
            });
        }
    } catch (error) {
        res.status(400).send({
            message: message.errorMessage.genericError,
            error: err.message,
        })
    }
}
exports.displayProduct = async (req, res) => {
    try {
        const role = req.body.role;
        if (role === "vendor") {
            const email = req.body.email;
            const user = await registerUser.findOne({
                email: email
            });
            const userId = user._id;
            await product.find({
                userId
            }, function (err, result) {
                if (err) {
                    res.status(400).send({
                        message: "no product available for this user",
                        error: err.message
                    });
                } else {
                    res.status(200).send({
                        message: message.infoMessage.getDetail,
                        data: result
                    });
                }
            });
        } else {
            res.status(400).send({
                message: message.errorMessage.wrongUser
            });
        }
    } catch (error) {
        res.status(400).send({
            message: message.errorMessage.genericError,
            error: error.message
        });
    }
}
exports.searchProduct=async(req,res)=>{
    try{
        const token = (req.headers['authorization']).substr(7);
        const decode = JWT.verify(token, config.JWTSecret);
        const productData=product.find({userId:decode._id});
        await product.find({productName:{'$regex':req.query.search}},(err,data)=>{if(err){
            res.status(400).send({message:"No data found",error:err.message});
        }else{
            res.status(200).send({message:message.infoMessage.getDetail,data:data});
        }
    })
}catch(error){
    res.status(400).send({message:message.errorMessage.genericError});
}
}