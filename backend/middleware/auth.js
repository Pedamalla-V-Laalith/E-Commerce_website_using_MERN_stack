const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

exports.isAuthenticatedUser = catchAsyncErrors(async (req,res,next)=>{
    const {token} = req.cookies
    if(! token){
        return next(new ErrorHandler("Please Login to access this resource", 401))
    }
    else {
        const decodedData = jwt.verify(token,"grfcctvybugguyfrsrwareduubht")
        req.user = await User.findById(decodedData.id)
        next()
    }
})

//middleware which takes in arguments
exports.authorizeRoles = (...roles)=>{
    return catchAsyncErrors(async (req,res,next)=>{
        //roles is an array/string which is recieved as an argument
        //in this array all the roles which are authorized to access appropriate
        //resources are there
        //the below if will be executed if the role of the user is not present in roles
        if(!(roles.includes(req.user.role)))
        {
            next(new ErrorHandler(`Role:  ${req.user.role} is not allowed to access this resource`,401))
        }
        else
        {
            next()
        }
    })
}