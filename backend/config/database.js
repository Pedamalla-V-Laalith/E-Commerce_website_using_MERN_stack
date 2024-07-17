const mongoose = require("mongoose")

const connectDataBase = () => {
    mongoose.connect('mongodb+srv://<username>:<password>@<cluster_name>.mongodb.net/', {dbName: "E_Commerce_website" })
}

module.exports = connectDataBase