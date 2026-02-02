const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
   
    //read the token
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).send("Please Login!!");
    }
    //validate my token
    const decodedValue = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { _id } = decodedValue;
    //find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not Exists");
    }
    req.user = user; //for usind user in next request handler
    next();
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};
module.exports = { userAuth };
