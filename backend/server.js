const app = require("./app.js")
const dotenv = require("dotenv")
const PORT = 3000
const connectDataBase = require("./config/database.js")
dotenv.config({path : "/backend/config/config.env"})
const cloudinary = require("cloudinary")


connectDataBase()
cloudinary.config({
    cloud_name : "cloud_name",
    api_key : "***********(api_key number)",
    api_secret : "*************(api_secret string)"
})

app.listen(PORT,()=>{
    console.log(`Server is working on http://localhost:${PORT}`)
})