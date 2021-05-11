const express = require("express");
require('dotenv').config({path: "../.env"});
const bodyParser = require("body-parser");
const environment = require("../environment");
const mongoose = require("./config/mongoose");
const routes = require("./app/routes/routes");
const cors=require("cors");
const env = process.env.NODE_ENV;
const envconfig = environment[env];
const port = envconfig.port || 3001;
const app = express();
app.use(cors());
mongoose.connect(envconfig, env);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use('/', routes);
app.listen(port, () => {
    console.log(`server running on ${port}`);
});