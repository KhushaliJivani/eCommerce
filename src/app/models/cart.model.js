const Mongoose = require("mongoose");
const cart = new Mongoose.Schema({
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'product.model',
    },
    productId: {
        type: String,
        ref: 'product.model',
    },
    quantity: {
        type: Number,
    },
    price:{
        type:Number,
    }
}, {
    timestamps: true,
})
const Cart = new Mongoose.model("cart", cart);
module.exports = Cart;