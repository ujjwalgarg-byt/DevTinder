const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:30

    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
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
    }
},
{
    timestamps:true
}
);

const User = mongoose.model("User",userSchema);
module.exports = User;