const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
//to encrypt password:-
const bcrypt = require("bcryptjs")
const crypto = require("crypto")


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please enter your name"],
        maxLength : [30,"Name cannot exceed 30 characters"],
        minLength : [4, "Name should have atleast 4 characters"]
    },
    email : {
        type : String,
        required : [true, "Please enter your email"],
        unique : true,
        validate : [validator.isEmail, "Please enter a valid email"]
    },
    password : {
        type : String,
        required : [true, "Please enter your password"],
        minLength : [8, "Name should have atleast 8 characters"],
        select : false
    },
    avatar : {
        public_id : {
            type : String,
            required : true
        },
        url : {
            type : String,
            required : true
        }
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now()
    },
    role : {
        type : String,
        default : "user"
    },
    resetPasswordToken : String,
    resetPasswordDate : Date
})
//event listener which gets executed before a document is being saved
//inside the function this represents the document which is about to be saved
//and we will be calling next() function to proceed with the save operation
userSchema.pre("save",async function(next){
    //note that if you update user details even then this function would be called
    //so we need to make sure that if user is not changing the password then we shall
    //not perform the encryption because if the password is not changed then it will encrypt
    //the encrypted text
    if(!this.isModified("password"))
    {
        //if the password is not modified then we would just not perform the encryption
        next()
    }
    this.password = await bcrypt.hash(this.password,10)

})
userSchema.methods.getJWTToken = function () {
    return jwt.sign({id : this._id},"grfcctvybugguyfrsrwareduubht",{expiresIn : "5d"})
}
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}
//generating password reset token
userSchema.methods.getResetPasswordToken = function() {
    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex")
    //Hashing and adding to user schema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordDate = Date.now() + (15 * 60 * 1000)
    return resetToken
}

module.exports = mongoose.model("User",userSchema)