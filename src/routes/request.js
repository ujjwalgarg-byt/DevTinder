const { userAuth } = require("../middlewares/auth");

const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { validateStatus } = require("../utils/validation");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
    
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    

    if(!validateStatus(req)){
        throw new Error("Please enter a valid status")
    };
    const toUser = await User.findById(toUserId);
    if(!toUser){
        throw new Error("User does not exist!")
    }
    
    // check if there are already exist connectionrequest and a pending request from current receiver to current sender
    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
        ]
    });
    if(existingConnectionRequest){
        throw new Error("Connection request already exists!")
    }
    
    const connectionRequest = new ConnectionRequest({
        fromUserId,toUserId,status
    });
    await connectionRequest.save();
    res.send("Request send successfully!");

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }

    
});

module.exports = requestRouter;