const { userAuth } = require("../middlewares/auth");

const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { validateStatus } = require("../utils/validation");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (!validateStatus(req)) {
        throw new Error("Please enter a valid status");
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User does not exist!");
      }

      // check if there are already exist connectionrequest and a pending request from current receiver to current sender
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        throw new Error("Connection request already exists!");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();
      res.send("Request send successfully!");
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

// create a api to review the request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try{
    const loggedInUser = req.user;
    const {status,requestId} = req.params;
    //validate status
    const validateStatus = ["accepted","rejected"];
    if(!validateStatus.includes(status)){
        return res.status(400).send("invalid status");
    }
    //validate requestId, check loggedinuserid is same as toUserId,and status should be interested
    const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested"
    });
    if(!connectionRequest){
        return res.status(400).send("invalid connection request!!");
    }
    connectionRequest.status = status;
    await connectionRequest.save();
    res.send(`Connection request ${status} successfully!!`);
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
