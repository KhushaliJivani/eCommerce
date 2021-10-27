const JWT = require("jsonwebtoken");
const configJWT = require("../../config/config");
exports.jwtvalidation = (req, res, next) => {

    const token = (req.headers['authorization']).substr(7);
    if (!token) {
        res.status(403).send({
            auth: false,
            message: 'no token is there'
        });
    } else {
        JWT.verify(token, configJWT.JWTSecret, (err, result) => {
            if (err) {
                res.send({
                    auth: false,
                    message: "Fail to authenticate a token",
                    code: 401
                });
            } else {
                next();
            }
        });
    }
}