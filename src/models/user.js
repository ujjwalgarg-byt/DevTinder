const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:30

    },
    lastName:{
        type:String,
        
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email adress " + value + " Please add a valid email address")
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Weak password " + value + " Please add a strong password")
            }
        }
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("user is not valid")
            }
        }
    },
    about:{
        type:String,
        default:"this is about of user"
    },
    Skills:{
        type:[String]
    },
    photoUrl:{
        type:String
    }

},
{
    timestamps:true
}
);
// schema method for creating token
userSchema.methods.getJWT= async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"Dev@Tinder$123",{expiresIn:"1d"});
    return token;
};

// schema method for validating password
userSchema.methods.validatePassword = async function(passwordInputbyUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordvalid = await bcrypt.compare(passwordInputbyUser,passwordHash);
    return isPasswordvalid;
};

const User = mongoose.model("User",userSchema);
module.exports = User;