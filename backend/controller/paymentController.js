const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const stripe_api_key = "stripe_api_key"
const stripe_secret_key = "stripe_secret_key"
const stripe = require("stripe")(stripe_secret_key)//we are passing it as an argument


exports.processPayment = catchAsyncErrors(async (req,res,next)=>{
    const myPayment = await stripe.paymentIntents.create({
        amount : req.body.amount,
        currency : "inr",
        description : "Ecommerce-stripe-transaction",//this is a formality that's it
        metadata : {
            company : "Ecommerce"
        }
    })
    res.status(200).send({
        success : true,
        client_secret : myPayment.client_secret
    })
})

exports.sendStripeApiKey = catchAsyncErrors(async (req,res,next)=>{
    res.status(200).send({stripe_api_key})
})