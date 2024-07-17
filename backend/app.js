const express = require("express")
const cookieParser = require("cookie-parser")
const errorMiddleware = require("./middleware/error")
const cors = require("cors")
const fileUpload = require("express-fileupload")

const app = express()
app.use(cookieParser())
app.use(express.json({limit: "50mb"}))//limit allows for larger sized files upto 50 mb, so that we won't encounter base64 url error
app.use(express.urlencoded({limit: "50mb", extended : true }))//allows for transfer of
//multiple formats of data to be transferred and not just strings and arrays
app.use(fileUpload())
app.use(cors({origin:"http://localhost:5173",credentials:true}))


const product = require("./routes/productRoute")
const user = require("./routes/userRoute")
const order = require("./routes/orderRoute")
const payment = require("./routes/paymentRoute")
app.use("/api/v1",product)
app.use("/api/v1",user)
app.use("/api/v1",order)
app.use("/api/v1",payment)

module.exports = app
app.use(errorMiddleware)