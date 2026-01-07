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
});

// get all the user form the db 

app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(400).send(err.message);
    }

});

// get a user by emailid
app.get("/user",async(req,res)=>{
    const userEmail = req.body.emailId;
    try{
        const users = await User.find({emailId:userEmail});
        if(users.length===0){
            res.send("user not found")
        }else{
            res.send(users);
        }
    }catch(err){
        res.status(400).send(err.message);
    }

});
// get only one user from the db if there are multiple users with same email
app.get("/userByname",async(req,res)=>{
    const userFisrstname = req.body.firstName;
    try{
        const users = await User.findOne({firstName:userFisrstname});
        if(!users){
            res.status(400).send("user not found");
        }else{
            res.send(users);
        }
    }catch(err){
        res.status(400).send(err.message);
    }

});
// get user by id
app.get("/userById",async(req,res)=>{
    const userId = req.body.userId;
    try{
       
        const users = await User.findById(userId);// shorthand of  User.findById({_id:userId});
        if(!users){
            res.status(400).send("user not found");
        }else{
            res.send(users);
        }
    }catch(err){
        res.status(400).send(err.message);
    }

});
// delete a user
app.delete("/user",async(req,res)=>{
    const userId = req.body.userId;
    try{
       
        const users = await User.findByIdAndDelete(userId);// shorthand of  User.findById({_id:userId});
        res.send("User deleted successfully");
    }catch(err){
        res.status(400).send(err.message);
    }

});
// update a user by id
app.patch("/user",async(req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        const users = await User.findByIdAndUpdate({_id:userId},data,{runValidators:true});
        res.send("User updated successfully");
    }catch(err){
        res.status(400).send(err.message);
    }

});
// update the user by emailid
app.patch("/userbyemail",async(req,res)=>{
    const email = req.body.email;
    const data = req.body;
    try{
        const users = await User.findOneAndUpdate({emailId:email},data);
        res.send("User updated successfully");
    }catch(err){
        res.status(400).send(err.message);
    }

});


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
