const Order = require("../models/orderModel")
const Product = require("../models/productModel")
const catchAsyncError = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/errorhandler")

exports.newOrder = catchAsyncError(async (req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        ShippingPrice,
        totalPrice
    } = req.body
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        ShippingPrice,
        totalPrice,
        paidAt : Date.now(),
        user : req.user.id
    })
    res.status(200).send({
        success : true,
        order
    })
})

exports.getSingleOrder = catchAsyncError(async (req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user", "name email") //only populating user with fields name and email only
    if(! order)
    {
        return next(new ErrorHandler("Order not found with this id",404))
    }
    res.status(200).send({
        success : true,
        order
    })
})

exports.myOrders = catchAsyncError(async (req,res,next)=>{
    const orders = await Order.find({user : req.user.id})
    if(! orders)
    {
        return next(new ErrorHandler("No Orders found",404))
    }
    res.status(200).send({
        success : true,
        orders
    })
})

//admin route
exports.allOrders = catchAsyncError(async (req,res,next)=>{
    const orders = await Order.find()
    if(! orders)
    {
        return next(new ErrorHandler("No Orders found",404))
    }
    let totalAmount = 0
    orders.forEach((order)=>{
        totalAmount += order.totalPrice
    })
    res.status(200).send({
        success : true,
        orders,
        totalAmount
    })
})

//admin route
exports.updateOrder = catchAsyncError(async (req,res,next)=>{
    const order = await Order.findById(req.params.id)
    if(! order)
    {
        return next(new ErrorHandler("Order not found with this id",404))
    }
    if(order.orderStatus == "Delivered")
    {
        return next(new ErrorHandler("you have already delivered this order",400))
    }
    //if the order is shipped then we have to reduce the stock of the products
    //in orderItems array
    //the status can be changed processing -> shipped -> delivered
    //if the order is already shipped we shouldn't update the stock again
    //while changing the status to delivered
    if((order.orderStatus != "Shipped"))
    {
        //this block will only run during transition of status from
        //Processing -> Shipped
        //and it won't run during the transition of Shipped -> Delivered
        //It also won't run after Delivered

        // order.orderItems.forEach(async (product) => {
            // // await checkStock(product.product, product.quantity, next)
            // const entireProduct = await Product.findById(product.product)
            // if(entireProduct.stock < product.quantity)
            // {
            //     errorflag = 1
            //     return next(new ErrorHandler(`A product with id:-${product.product} has quantity in the order which exceeds it's stock`))
            // }
        // })
        //we are having issues with forEach function
        //so we are using the below format which works in the exact same fashion
        for(const product of order.orderItems)
        {
            //checking whether the stock for all products is available or
            //not is necessary here to decide whether to ship or not
            
            // await checkStock(product.product, product.quantity, next)
            const entireProduct = await Product.findById(product.product)
            if(entireProduct.stock < product.quantity)
            {
                return next(new ErrorHandler(`A product with name:-${product.name} has quantity in the order which exceeds it's stock`))
            }
        }
        // order.orderItems.forEach(async (product) => {
            // // await updateStock(product.product, product.quantity)
            // const entireProduct = await Product.findById(product.product)
            // entireProduct.stock -= product.quantity
            // await entireProduct.save({validateBeforeSave : false})
        // })
        for(const product of order.orderItems)
        {
            // await updateStock(product.product, product.quantity)
            const entireProduct = await Product.findById(product.product)
            entireProduct.stock -= product.quantity
            await entireProduct.save({validateBeforeSave : false})
        }
    }
    order.orderStatus = req.body.status
    if(req.body.status == "Delivered")
    {
        order.deliveredAt = Date.now()
    }
    await order.save({validateBeforeSave : false})
    res.status(200).send({
        success : true
    })
})
// async function checkStock(productId, orderQuantity, next)
// {
//     const product = await Product.findById(productId)
//     if(product.stock < orderQuantity)
//     {
//         return next(new ErrorHandler(`A product with id:-${productId} has quantity in the order which exceeds it's stock`))
//     }
// }
// async function updateStock(productId, orderQuantity)
// {
//     const product = await Product.findById(productId)

//     product.stock -= orderQuantity

//     await product.save({validateBeforeSave : false})
// }

//admin route
exports.deleteOrder = catchAsyncError(async (req,res,next)=>{
    const order = await Order.findByIdAndDelete(req.params.id)
    if(! order)
    {
        return next(new ErrorHandler("Order does not exist",404))
    }
    res.status(200).send({
        success : true,
        message : "Deleted Succefully"
    })
})