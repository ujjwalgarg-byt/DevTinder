const express = require("express");
const {validateSignUpApi}= require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authRouter = express.Router();

// create a api to send the user data to db
authRouter.post("/signup",async(req,res)=>{
    
    // console.log(req.body);
    
    // const userObj={  // hsrd coded data
    //     firstName:"Atul",
    //     lastName:"Saini",
    //     emailId:"atusaini@gmail.com",
    //     password:"atulsaini@120",
    //     age:"22",
    //     gender:"Male",
    // }
    
    try{

        validateSignUpApi(req);//validation of data

        const {firstName,lastName,emailId,password,Skills,photoUrl} = req.body;

        const passwordHash = await bcrypt.hash(password,10);// encrypting password

        //create a new instance of user model to save the data
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash,
            Skills,
            photoUrl
            // only add fields which you want to send ,if you add another fields in api they will just ignored
        });

         const savedUser = await user.save();
         const token = await savedUser.getJWT();
         res.cookie("token",token,{expires:new Date(Date.now()+1*3600000)});
        res.json({message:"User added successfully!!",data:savedUser});
    }catch(err){
        res.status(400).send("Error : " + err.message);
    }
});


// login api
authRouter.post("/logIn",async(req,res)=>{
    try{
        const {emailId,password} = req.body;
        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid credentials");//always use this type of err msg for secure db
        }
        const isPasswordvalid =await user.validatePassword(password);
        if (!isPasswordvalid) {
        throw new Error("Invalid credentials");
        }
        // generate token
        const token = await user.getJWT();
        // add the token inside cookie and send the response back to the user
        res.cookie("token",token,{expires:new Date(Date.now()+1*3600000)});
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
    

});
// create logout api
authRouter.post("/logOut",async(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("LogOut successfull");
})

module.exports = authRouter;