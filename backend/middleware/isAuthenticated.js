const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = async (req, res, next) => {
    try {
        const beare = req.headers.authorization
        if(!beare){
            logger.warn("Authentication failed: Bearer header not valid", { ip: req.ip, path: req.path });
            return next(new ErrorHandler("Beare header not valid", 402));
        }

        const token = beare.split(' ')[1]
        if (!token){
            logger.warn("Authentication failed: Token not found", { ip: req.ip, path: req.path });
            return next(new ErrorHandler("Token not found", 402));
        }

        const decodedToken = jwt.verify(token, process.env.SECRETKEY)

        if(!decodedToken){
            logger.warn("Authentication failed: Token not valid", { ip: req.ip, path: req.path });
            return next(new ErrorHandler("Token not valid", 402));
        }
        
        req.username = decodedToken.username
        logger.info("User authenticated successfully", { username: decodedToken.username, path: req.path });
        next()
    } catch (error) {
        logger.error("Authentication error", { error: error.message, ip: req.ip, path: req.path });
        next(error);
    }
}