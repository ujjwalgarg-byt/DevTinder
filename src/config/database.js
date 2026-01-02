const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://ujjwalgarg:lyDtKsdMOrwYLPvV@ujjwal-cluster.b6k3l5k.mongodb.net/DevTinder");
};
module.exports = connectDB;
