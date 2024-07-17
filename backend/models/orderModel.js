const mongoose = require ("mongoose")

const orderSchema = new mongoose.Schema({
    shippingInfo : {
        address : {type : String, required : [true,"Please enter address"]},
        city : {type : String, required : [true,"Please enter city"]},
        state : {type : String, required : [true,"Please enter state"]},
        country : {type : String, required : [true,"Please enter country"]},
        pincode : {type : Number, required : [true,"Please enter pincode"]},
        phoneNo : {type : Number, required : [true,"Please enter Phone number"]}
    },
    orderItems : [
        {
            name : {type : String, required : [true,"name not specified"]},
            price : {type : Number, required : [true,"price not specified"]},
            quantity : {type : Number, required : [true,"quantity not specified"]},
            image : {type : String, required : [true,"image url not specified"]},
            product : {type : mongoose.Schema.ObjectId, ref : "Product", required : [true,"product not specified"]}
        }
    ],
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    paymentInfo : {
        id : {
            type : String,
            required : true
        },
        status : {
            type : String,
            required : true
        }
    },
    paidAt : {
        type : Date,
        required : true
    },
    itemsPrice : {
        type : Number,
        required : true,
        default : 0
    },
    taxPrice : {
        type : Number,
        required : true,
        default : 0
    },
    shippingPrice : {
        type : Number,
        required : true,
        default : 0
    },
    totalPrice : {
        type : Number,
        required : true,
        default : 0
    },
    orderStatus : {
        type : String,
        required : true,
        default : "Processing"
    },
    deliveredAt : Date,
    createdAt : {type : Date, default : Date.now()}
})

module.exports = mongoose.model("Order",orderSchema)