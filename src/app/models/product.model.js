const Mongoose = require("mongoose");
const productSchema = new Mongoose.Schema({
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'user.model',
    },
    productName: {
        type: String,
    },
    productPrice: {
        type: Number,
    },
    stock: {
        type: Number,
    },
    productImage: [{
        type: String,
        required: true,
    }]
})
const Product = new Mongoose.model("product", productSchema);
module.exports = Product;