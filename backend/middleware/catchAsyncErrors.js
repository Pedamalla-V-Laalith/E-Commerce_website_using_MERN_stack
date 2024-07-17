module.exports = (theFunc) => (req,res,next)=>{
    Promise.resolve(theFunc(req,res,next)).catch(next)
    //here any error that might occur in resolve function
    //that error will be passed as an argument to the function in the argument of catch
    //i.e. next()
    //and then the default behaviour in node is, if any error is passed as the argument to
    //the next function then among the succesive middlewares, the middleware which accepts the argument
    //for error as err will be executed, skipping all the other middlewares that come in between.
}