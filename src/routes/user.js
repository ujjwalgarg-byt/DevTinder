const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const USER_DATA = "firstName lastName Skills about";
// get all the received pending request for loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
      //}).populate("fromUserId",["firstName","lastName"]);// to get the data of fromUserId from User model
    }).populate("fromUserId", USER_DATA); // or
    res.json({ message: "Data fetched successfully", data: pendingRequests });
  } catch (err) {
    res.status(400), send("ERROR :" + err.message);
  }
});
// get all the connections of loggedIn User
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_DATA)
      .populate("toUserId", USER_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    }); // modify data to get only info about fromUserId's user
    res.send(data);
  } catch (err) {
    res.status(400), send("ERROR :" + err.message);
  }
});

module.exports = userRouter;
