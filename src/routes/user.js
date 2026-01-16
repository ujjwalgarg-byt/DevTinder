const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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
    res.status(400).send("ERROR :" + err.message);
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
    res.status(400).send("ERROR :" + err.message);
  }
});
// get you the profiles of other user on platform excepting you own profile or the user whom you send the request/reject the request and accept/ignored the request

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // find all the connection request which are related to me (sent and received)
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId"); //use to find only selected fields

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    // get all the user except hide users
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = userRouter;
