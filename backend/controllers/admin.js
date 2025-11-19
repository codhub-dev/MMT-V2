const { catchAsyncError } = require('../middleware/catchAsyncError');
const ErrorHandler = require('../middleware/errorHandlers');
const userModel = require('../models/user-model');

module.exports.getAlluser = catchAsyncError(async (req, res, next) => {
    const users = await userModel.find({})

    if(!users){
        return next(new ErrorHandler("Failed to create user", 500));
    }

    res.status(200).json({
        message: "All user",
        users: users
    })
});

module.exports.getOneUserByUsername = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findOne({ 
        username: req.params.username 
    })
        
    if(!user){
        return next(new ErrorHandler("Failed to create user", 500));
    }

    res.status(200).json({
        message: "User found",
        user: user
    })
});

module.exports.deleteOneUserByUsername = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findOneAndDelete({ 
        username: req.params.username 
    })
        
    if(!user){
        return next(new ErrorHandler("Failed to create user", 500));
    }

    res.status(200).json({
        message: "User found",
        user: user
    })
});

module.exports.manageSubscription = catchAsyncError(async (req, res, next) => {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    user.isSubscribed = !user.isSubscribed;
    await user.save();

    res.status(200).json({
        message: `User ${user.isSubscribed ? "subscribed" : "unsubscribed"} successfully`,
        user,
    });
});