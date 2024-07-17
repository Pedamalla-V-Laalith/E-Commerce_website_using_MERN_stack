const User = require("../models/userModel")
const catchAsyncError = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/errorhandler")
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const cloudinary = require ("cloudinary")

exports.registerUser = catchAsyncError(async (req,res,next)=>{
    const defaultPublic_Id = "defaultPublic_Id_of_image"
    const defaultUrl = "https://res.cloudinary.com/url/of/the/image/defaultPublic_Id_of_image.jpg"
    if(req.body.avatar != "defaultAvatar")
    {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder : "E-Commerce_website/user_avatars", //these pics will be uploaded in this folder on cloudinary
            width : 150,
            crop : "scale"
        })
        const {name,email,password} = req.body
        const user = await User.create({
            name,
            email,
            password,
            avatar : {
                public_id : myCloud.public_id,
                url : myCloud.secure_url
            }
        })
        sendToken(user,201,res)
    }
    else //if the user does not provide an image this will be default
    {
        const {name,email,password} = req.body
        const user = await User.create({
            name,
            email,
            password,
            avatar : {
                public_id : defaultPublic_Id,
                url : defaultUrl
            }
        })
        sendToken(user,201,res)
    }
})

exports.loginUser = catchAsyncError(async (req,res,next)=>{
    const {email,password} = req.body
    if(!(email) || !(password))
    {
        return next(new ErrorHandler("Please Enter Email and/or password",400))
    }
    const user = await User.findOne({email}).select("+password")
    //we are doing this because we mentioned select false for password in
    //User model and in order to get password also we need to do this
    if(!user)
    {
        return next(new ErrorHandler("Invalid email or password",401))
    }
    const isPasswordMatched = await user.comparePassword(password)//boolean
    if(!isPasswordMatched)
    {
        return next(new ErrorHandler("Invalid email or password",401))
    }
    sendToken(user,200,res)
})

exports.logoutUser = catchAsyncError(async (req,res,next)=>{
    let options = {
        expires : new Date(Date.now()),
        httpOnly : true
    }
    res.cookie("token",null,options)

    res.status(200).send({
        success : true,
        message : "Logged Out"
    })
})

exports.forgotPassword = catchAsyncError(async (req,res,next)=>{
    const user = await User.findOne({email : req.body.email})
    if(!(user))
    {
        next(new ErrorHandler("User not found",404))
    }
    else
    {
       const resetToken = user.getResetPasswordToken()
    //    console.log(resetToken)
       await user.save({validateBeforeSave : false})
    //    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
       const resetPasswordUrl = `http://localhost:5173/password/reset/${resetToken}`
    //    console.log(resetPasswordUrl)
       //here req.protocol returns the protocol such as http or https
       //req.get("host") returns the host in case of localhost at port 3000 
       //it will return localhost:3000

       //basically here we will use node-mailer to send mail of the url to reset
       //the password for the user
       //let us now write the content of the mail.
       const message = `Your password reset url is :- \n\n${resetPasswordUrl}\n\nIf you have not
       requested this mail then Please ignore it`

       try {
        await sendEmail({
            email : user.email,
            subject : "Ecommerce Password Recovery",
            message
        })
        res.status(200).send({
            success : true,
            message : "mail to change your password is sent to your Registered email"
        })
        
       } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordDate = undefined
        await user.save({validateBeforeSave : false})
        return next(new ErrorHandler(error.message,500))
       }

    }
})

exports.resetPassword = catchAsyncError(async (req,res,next) => {
    //creating token hash
    const resetToken = req.params.token
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordDate : {$gt : Date.now()} //checking whether the time to reset password expired or not
    })
    if(!(user))
    {
        next(new ErrorHandler("User not found or invalid link or time limit expired",404))
    }
    else
    {
        if(req.body.password != req.body.confirmPassword)
        {
            return next(new ErrorHandler("Confirm password does not match password",400))
        }
        else
        {
            user.password = req.body.password
            user.resetPasswordToken = undefined
            user.resetPasswordDate = undefined
            await user.save()
            sendToken(user,200,res)
        }
    }
})

exports.getUserDetails = catchAsyncError(async (req,res,next) => {
    const user = await User.findById(req.user.id)
    if(!user)
    {
        return next(new ErrorHandler("User does not exist",400))
    }
    res.status(200).send({
        success : true,
        user
    })
})

exports.updatePassword = catchAsyncError(async (req,res,next) => {
    const {oldPassword, newPassword, confirmPassword} = req.body
    const user = await User.findById(req.user.id).select("+password")
    if(!user)
    {
        return next(new ErrorHandler("User does not exist",400))
    }
    const isPasswordMatched = await user.comparePassword(oldPassword)//boolean
    if(!isPasswordMatched)
    {
        return next(new ErrorHandler("Old password is incorrect",400))
    }
    if(newPassword != confirmPassword)
    {
        return next(new ErrorHandler("Password does not match",400))
    }
    user.password = newPassword
    await user.save()
    sendToken(user,200,res)
})

exports.updateProfile = catchAsyncError(async (req,res,next) => {
    if(req.body.avatar == "")
    {
        const newUserData = {
            name : req.body.name,
            email : req.body.email,
        }
        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {new : true, runValidators : true, useFindAndModify : false})
        if(!user)
        {
            return next(new ErrorHandler("User does not exist",400))
        }
        res.status(200).send({
            success : true, 
        })
    }
    else
    {
        const imageId = req.user.avatar.public_id //public id of old image
        
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder : "E-Commerce_website/user_avatars", //these pics will be uploaded in this folder on cloudinary
            width : 150,
            crop : "scale"
        })
        const newUserData = {
            name : req.body.name,
            email : req.body.email,
            avatar : {
                public_id : myCloud.public_id,
                url : myCloud.secure_url
            }
        }
        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {new : true, runValidators : true, useFindAndModify : false})
        if(!user)
        {
            return next(new ErrorHandler("User does not exist",400))
        }
        if(imageId != "defaultPublic_Id_of_image"){
            await cloudinary.v2.uploader.destroy(imageId) //deleting the previous image
        }
        res.status(200).send({
            success : true, 
        })
    }
})

//admin route:-

exports.getAllUsers = catchAsyncError(async (req,res,next)=>{
    const users = await User.find()

    res.status(200).send({
        success : true,
        users
    })
})

exports.getSingleUser = catchAsyncError(async (req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(! user)
    {
        return next(new ErrorHandler(`User with id: ${req.params.id} does not exist`,400))
    }
    res.status(200).send({
        success : true,
        user
    })
})

exports.updateUserRole = catchAsyncError(async (req,res,next) => {
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {new : true, runValidators : true, useFindAndModify : false})
    if(! user)
    {
        return next(new ErrorHandler(`User with id: ${req.params.id} does not exist`,400))
    }
    res.status(200).send({
        success : true,
        message : "Updated successfully" 
    })
})

exports.deleteUser = catchAsyncError(async (req,res,next) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if(! user)
    {
        return next(new ErrorHandler(`User with id: ${req.params.id} does not exist`,400))
    }
    const imageId = user.avatar.public_id
    if(imageId != "defaultPublic_Id_of_image"){
        await cloudinary.v2.uploader.destroy(imageId) //deleting the previous image
        //and the url in the if condition is the default avatar
    }
    res.status(200).send({
        success : true, 
        message : "User deleted successfully"
    })
})