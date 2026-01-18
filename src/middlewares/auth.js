const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async(req,res,next)=>{
     try{
        //read the token
        const cookies = req.cookies;
        const {token} = cookies;
        if(!token){
                res.status(401).send("Please Login!!");
        } 
        //validate my token 
        const decodedValue = await jwt.verify(token ,"Dev@Tinder$123" );
        const {_id} = decodedValue;
        //find the user
        const user = await User.findById(_id);
        if(!user){
                throw new Error("User does not Exists");
        }    
        req.user = user;//for usind user in next request handler
        next();
        }catch(err){
            res.status(400).send("Error : " + err.message);
        }

};
module.exports = {userAuth};