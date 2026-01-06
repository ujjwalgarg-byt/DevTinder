const express = require("express");

const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
app.use(express.json());//middleware for converting json data(daynamic data which will passed by api) into js object
// create a api to send the user data to db
app.post("/signup",async(req,res)=>{
    
    // console.log(req.body);
    
    // const userObj={  // hsrd coded data
    //     firstName:"Atul",
    //     lastName:"Saini",
    //     emailId:"atusaini@gmail.com",
    //     password:"atulsaini@120",
    //     age:"22",
    //     gender:"Male",
    // }
    //create a new instance of user model to save the data
    const user = new User(req.body);
    try{
        await user.save();
        res.send("user added successfully!");
    }catch(err){
        res.status(400).send(err.message);
    }
})


connectDB()
    .then(()=>{
        console.log("database connection established");
        app.listen(3000,()=>{
        console.log("Server is successfully listening on port 3000....");
    
        });
        
    })
    .catch((err)=>{
        console.error("database can not be connected!!")
    })
