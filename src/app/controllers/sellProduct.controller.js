require("../routes/routes");
const cart = require("../models/cart.model");
const message = require("../../config/message");
const product = require("../models/product.model");
const registerUser = require("../models/user.model");
const JWT=require("jsonwebtoken");
const config=require("../../config/config");
exports.addToCart = async (req, res) => {
    try {
        const token = (req.headers['authorization']).substr(7);
        const decode = JWT.verify(token, config.JWTSecret);
        const productId = req.params.id;
        const quantity = req.body.quantity;
        const productData = await product.findOne({
            _id: productId
        });
        if (req.body.quantity <= productData.stock) {
            const getAvailableItem = await cart.findOne({
                productId: productId
            });
            if (getAvailableItem) {
                const cartQuantity = getAvailableItem.quantity;
                const totalQuantity = cartQuantity + quantity;
                const newPrice=totalQuantity*productData.productPrice;
                if (totalQuantity <= productData.stock) {
                    const updateItem = await cart.updateOne({
                        productId: productId
                    }, {
                        $set: {
                            quantity: totalQuantity,price:newPrice
                        }
                    });
                        const cartData=await cart.findOne({productId:productId});
                        res.status(200).send({message:message.infoMessage.updateDetails,data:productData,cartData});
                } else {
                    res.status(400).send({
                        message: message.errorMessage.QunatityNotThere
                    });
                }
            } else {
                const cartData = new cart({
                    userId: decode._id,
                    productId: productId,
                    quantity: quantity,
                    price: quantity*productData.productPrice,

                })
                const addcartData = await cartData.save();
                res.status(200).send({message:message.infoMessage.saveDetail,data:addcartData,productData});
            }
        } else {
            res.status(400).send({
                message: message.errorMessage.QunatityNotThere,
            })
        }
    } catch (error) {
        res.status(400).send({message:message.errorMessage.genericError});
    }
}
exports.editCart=async(req,res)=>{
    try{
    const token = (req.headers['authorization']).substr(7);
    const decode = JWT.verify(token, config.JWTSecret);
    const productId = req.params.id;
    const quantity=req.body.quantity;
    const cartData = await cart.findOne({
        productId:productId
    });
    const productData = await product.findOne({
        _id: productId
    });
    if (req.body.quantity <= productData.stock) {
        let newPrice=quantity*productData.productPrice;
        let editCart = await cart.updateOne({
            _id: cartData._id
        }, {
            $set: {
                quantity: quantity,price:newPrice
            }
        });
        const dispCart=await cart.find({userId:decode._id});
    res.status(200).send({message:message.infoMessage.saveDetail,data:dispCart,productData});
}else{
    res.status(400).send({message:message.errorMessage.QunatityNotThere});
}
    }catch(error){
        res.status(400).send({
            message:message.errorMessage.genericError,
        })
    }
}
exports.deleteCart=async(req,res)=>{
    try{
        const token = (req.headers['authorization']).substr(7);
        const decode = JWT.verify(token, config.JWTSecret);
        let productId=req.params.id;
        const deletedData = await cart.deleteOne({
            productId:productId,
        });
        const cartData=await cart.find({userId:decode._id});
        res.status(200).send({message:message.infoMessage.deleteDetails,data:cartData});
    }catch(error){
        res.status(400).send({message:message.errorMessage.genericError});
    }
}