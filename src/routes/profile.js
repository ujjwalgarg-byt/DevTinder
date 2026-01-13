const express = require("express");
const {userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const {validateEditProfileData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const profileRouter = express.Router();

// get profile by cookie
profileRouter.get("/profile/view",userAuth,async(req,res)=>{
   try{
        const users = req.user;
        res.send(users);
    }catch(err){
        res.status(400).send("Error : " + err.message);
    }
});

// create a api for edit profile
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    const data = req.body;
    const loggedinUser = req.user;
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit Request");
        }
        Object.keys(data).forEach(key=>loggedinUser[key]=data[key])
        await loggedinUser.save();
        
        // res.send("User updated successfully");
        //we can also send msg like this
        res.json({message: `${loggedinUser.firstName} , your profile updated successfully`,data:loggedinUser});
        

    }catch(err){
        res.status(400).send("Error : " + err.message);
    }
});
// create a api for forgoting password
profileRouter.patch("/profile/editPassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new Error("Both current and new password are required");
    }else if(currentPassword===newPassword){
        throw new Error("Does not enter old password");
    }

    // validate current password
    const isValidCurrenPassword = await user.validatePassword(currentPassword);
    if (!isValidCurrenPassword) {
      throw new Error("Invalid credential");
    }
    if(!validator.isStrongPassword(newPassword)){
        throw new Error("Please enter strong password");
    }

    // hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.send("Password updated successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});


module.exports = profileRouter;