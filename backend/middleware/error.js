const ErrorHandler = require("../utils/errorhandler")


module.exports = (err,req,res,next) => {
    err.statuscode = err.statuscode || 500
    err.message = err.message || "Internal Server Error"
    if(err.code == 11000)
    {
        return res.status(400).send({
            success : false,
            message : `Duplicate ${Object.keys(err.keyValue)} Entered`
        })
    }
    if(err.name == "JsonWebTokenError")
    {
        return res.status(400).send({
            success : false,
            message : `Json Web Token is invalid, Try again`
        })
    }
    if(err.name == "TokenExpiredError")
    {
        return res.status(400).send({
            success : false,
            message : `Json Web Token is expired, Try again`
        })
    }
    res.status(err.statuscode).send({
        success : false,
        message : err.message
    })
}