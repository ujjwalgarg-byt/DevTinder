 const mongoose = require("mongoose");


 const connectionRequestSchema = mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",// reference to the user collection
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is not suppoted`
        }
    }
 },{timestamps:true}
);
//set index
connectionRequestSchema.index({fromUserId:1,toUserId:1});
//schema pre
connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    // check if fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){//can not directly compare b'coz fromuserid is a objectId type and touserid is a string type
        throw new Error("Invalid request: cannot send request to yourself")
    }
})

const ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports = ConnectionRequest;