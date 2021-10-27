const Mongoose = require("mongoose");
const orderProduct = new Mongoose.Schema({
    productId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'product.model',
    },
    orderProductName: {
        type: String,
    },
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'user.model',
    },
    totalPrice: {
        type: Number,
    },
    orderedQuantity: {
        type: Number,
    },
})
const Order = new Mongoose.model("Order", orderProduct);
module.exports = Order;


