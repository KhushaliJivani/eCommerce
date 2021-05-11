const mongoose = require("mongoose");
exports.connect = (envConfig, env) => {

    mongoose.connect(envConfig.mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(() => {
        console.log("connection successfull");
    }).catch((err) => {
        console.log(err);
    })
    return mongoose.connection;
};