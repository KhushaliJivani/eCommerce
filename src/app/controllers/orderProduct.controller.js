require("../routes/routes");
const JWT=require("jsonwebtoken");
const config=require("../../config/config");
const message = require("../../config/message");
const cart=require("../models/cart.model");
const product=require("../models/product.model");
const orderProduct=require("../models/orderProduct.model");
const stripe=require("stripe")(config.secretKey);
let totalOrderedPrice=0;
exports.orderProducts = async (req, res) => {
    try {
        const token = (req.headers['authorization']).substr(7);
        const decode = JWT.verify(token, config.JWTSecret);
        const cartData = await cart.find({
            userId:decode._id
        });
        cartData.forEach(async cartData=>{
            let quantity=cartData.quantity;
            let price=cartData.price;
            const productData=await product.findOne({_id:cartData.productId});
            totalOrderedPrice+=price;
                const orderedProduct = new orderProduct({
                productId: cartData.productId,
                orderProductName: productData.productName,
                userId:decode._id,
                totalPrice:price,
                orderedQuantity: cartData.quantity,
            })
            const ordered =await orderedProduct.save();

        }) 
        for(let data of cartData){
               const cartQuantity=data.quantity;
                const productData =await product.findOne({
                    _id: data.productId});
                    let finalQuantity = productData.stock - data.quantity;
            const productresult =await product.updateOne({
                _id: data.productId
            }, {
                $set: {
                    stock: finalQuantity
                }
            });
        }
        res.status(200).send({message:message.infoMessage.saveDetail,totalPrice:totalOrderedPrice});

    } catch (error) {
        res.status(400).send({message:message.errorMessage.genericError});
    }
}
exports.history=async(req,res)=>{
    const token = (req.headers['authorization']).substr(7);
    const decode = JWT.verify(token, config.JWTSecret);
    const history=orderProduct.find({userId:decode._id});
    res.status(200).send({message:message.infoMessage.getDetail,data:history});
}

exports.payment=async(req,res)=>{

    res.render('index');
}

exports.paymentExtra=(req,res)=>{
    console.log(req.body.stripeEmail);
    console.log(req.body.stripeToken);
    stripe.customers.create({
        email: req.body.stripeEmail, 
        source: req.body.stripeToken, 
        name:'Khushali Jivani',
        address:{
            line1:' 811 Crowfield Road',
            postal_code:'85034',
            city:'Phoenix',
            state:'Arizona',
            country:'United States',
            
        }
    }).then((customer)=>{
        return stripe.charges.create({
            amount:7000,
            description:'product',
            currency:'USD',
            customer:customer.id
        })
    }).then((charge)=>{
        console.log(charge);
        res.send('success');
    }).catch((err)=>{
        res.status(400).send({error:err});
    })
}