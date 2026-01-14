const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

// get all the pending request of a user
userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const pendingRequests = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        //}).populate("fromUserId",["firstName","lastName"]);// to get the data of fromUserId from User model
        }).populate("fromUserId","firstName lastName Skills about");// or
        res.json({message:"Data fetched successfully",data:pendingRequests});

    }catch(err){
        res.status(400),send("ERROR :" + err.message);
    }
});

module.exports = userRouter;
