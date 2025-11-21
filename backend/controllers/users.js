const { catchAsyncError } = require('../middleware/catchAsyncError');
const ErrorHandler = require('../middleware/errorHandlers');
const userModel = require('../models/user-model');
const logger = require('../utils/logger');

module.exports.getMyProfile = catchAsyncError(async (req, res, next) => {
    const { decodedUser } = req.body;

    if (!decodedUser) {
        logger.warn("Profile request attempted with invalid application id");
        return next(new ErrorHandler("Application id not valid", 400));
    }

    const user = await userModel.findOne({ 
        username: decodedUser.username 
    });
    
    delete user.password;

    logger.info(`Profile retrieved successfully for user ${decodedUser.username}`, {
        username: decodedUser.username
    });

    res.json({
        code: 200,
        message: 'Profile found',
        user: user,
    });
});