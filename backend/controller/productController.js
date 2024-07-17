const Product = require("../models/productModel")
const catchAsyncError = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/errorhandler")
const ApiFeatures = require("../utils/apifeatures")
const cloudinary = require("cloudinary")

//this is an admin route
exports.createProduct = catchAsyncError(async (req,res,next) => {
    req.body.user = req.user.id//req.user.id is assigned in isAuthenticatedUser middleware
    const images = [...req.body.images]
    req.body.images = []
    req.body.images = await Promise.all(images.map(async (image)=>{
        const myCloud = await cloudinary.v2.uploader.upload(image,{
            folder : "E-Commerce_website/products", //these pics will be uploaded in this folder on cloudinary
            width : 150,
            crop : "scale"
        })
        let obj = {
            public_id : myCloud.public_id,
            url : myCloud.secure_url
        }
        return obj
    }))
    /*
    Since uploading images to cloudinary is an asynchronous function, we are using Promise.all function
    here map function returns the array consisting of promises 
    each promise is basically the async function we gave in the argument of map function
    Since using await directly onto the map function doesn't do anything because await does not take
    effect on array of promises
    That's why we are using Promise.all function which resolves all the promises in the array passed
    in the argument of Promis.all by map function.
    */
    const product = await Product.create(req.body)
    res.status(201).send({
        success : true,
        product
    })
})
//this is an admin route
exports.updateProduct = catchAsyncError(async (req,res,next) => {
    let product = await Product.findById(req.params.id)
    if(!product)
    {
        return next(new ErrorHandler("Product not found",404))
    }
    else
    {
        if(req.body.images.length == 0){
            //this means that user decided to not change any images.
            req.body.images = undefined
        }
        else{
            originalImages = product.images
            //deleting the previous images
            for(let i = 0; i < originalImages.length; i++){
                let public_id = originalImages[i].public_id
                await cloudinary.v2.uploader.destroy(public_id)
            }
            //uploading new images and updating them to req.body.images
            const images = [...req.body.images]
            req.body.images = []
            req.body.images = await Promise.all(images.map(async (image)=>{
                const myCloud = await cloudinary.v2.uploader.upload(image,{
                    folder : "E-Commerce_website/products", //these pics will be uploaded in this folder on cloudinary
                    width : 150,
                    crop : "scale"
                })
                let obj = {
                    public_id : myCloud.public_id,
                    url : myCloud.secure_url
                }
                return obj
            }))
        }
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true, useFindAndModify : false})
        res.status(200).send({
            success : true,
            product
        })
    }
})
//this is an admin route
exports.deleteProduct = catchAsyncError(async (req,res,next) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    if(product)
    {
        const images = product.images
        for(let i = 0; i < images.length; i++){
            let public_id = images[i].public_id
            await cloudinary.v2.uploader.destroy(public_id)
        }
        return res.status(200).send({
            success : true,
            message : "Product deleted successfully"
        })
    }
    else
    {
        return next(new ErrorHandler("Product not found",404))
    }
})

exports.getAllProducts = catchAsyncError(async (req,res,next) => {
    const resultPerPage = 8
    const apiFeatures = new ApiFeatures(Product.find(),req.query).search().filter()
    let products = await apiFeatures.query
    const productsCount = products.length
    apiFeatures.pagination(resultPerPage)
    products = await apiFeatures.query.clone()
    res.status(200).send({
        success : true,
        products,
        productsCount,
        resultPerPage
    })
})

exports.getAdminProducts = catchAsyncError(async (req,res,next) => {
    //this method is to get each and every product for admins only without any 
    //filter or pagination
    const products = await Product.find()

    res.status(200).send({
        success : true,
        products
    })
})

exports.getProduct = catchAsyncError(async (req,res,next) => {
    // const productCount = await Product.countDocuments()
    const product = await Product.findById(req.params.id)
    if(product)
    {
        res.status(200).send({
            success : true,
            product,
            // productCount
        })
    }
    else
    {
        return next(new ErrorHandler("Product not found",404))
    }
})

//create new review or update review
exports.createProductReview = catchAsyncError(async (req,res,next)=>{
    const {rating, comment, productId} = req.body
    const review = {
        user : req.user.id,
        name : req.user.name,
        rating : Number(rating),
        comment,        
    }
    const product = await Product.findById(productId)
    if(! product)
    {
        return next(new ErrorHandler("Product not found",404))
    }
    const isReviewed = product.reviews.find(rev => rev.user.toString() == req.user.id.toString())
    if(isReviewed)
    {
        product.reviews.forEach((rev)=>{
            if(rev.user.toString() == req.user.id.toString())
            {
                rev.rating = Number(rating)
                rev.comment = comment
            }
        })
        product.numOfReviews = product.reviews.length
        let sum = 0
        product.reviews.forEach((rev)=>{
            sum += rev.rating
        })
        product.ratings = sum / product.numOfReviews
        await product.save({validateBeforeSave : false})
        res.status(200).send({
            success : true,
            message : "Review updated successfully"
        })
    }
    else
    {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
        let sum = 0
        product.reviews.forEach((rev)=>{
            sum += rev.rating
        })
        product.ratings = sum / product.numOfReviews
        await product.save({validateBeforeSave : false})
        res.status(200).send({
            success : true,
            message : "Review created successfully"
        })
    }
})

//getting all reviews
exports.getProductReviews = catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.query.productId)
    if(! product)
    {
        return next(new ErrorHandler("Product not found",404))
    }
    res.status(200).send({
        success : true,
        reviews : product.reviews
    })
})

//delete review
exports.deleteReview = catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.query.productId)
    if(! product)
    {
        return next(new ErrorHandler("Product not found",404))
    }
    const reviews = product.reviews.filter(rev => rev.id.toString() != req.query.id)//req.query.id will contain id of the review inside the reviews array
    product.reviews = reviews
    product.numOfReviews = product.reviews.length
    let sum = 0
    product.reviews.forEach((rev)=>{
        sum += rev.rating
    })
    product.ratings = sum / product.numOfReviews
    await product.save()
    res.status(200).send({
        success : true,
        message : "Review deleted"
    })
})