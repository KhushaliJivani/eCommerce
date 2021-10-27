const {
    createLogger,
    transports,
    format
} = require("winston");

const logger = createLogger({
    transports: [
        new transports.Console({
            level:'warn',
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.File({
            filename: 'info.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        })
        
    ]
})
module.exports = logger;