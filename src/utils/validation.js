const validator = require("validator")
const validateSignUpApi=(req)=>{
    const{firstName,lastName,emailId,password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid!");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Enter a valid email");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password!");
    }
};

const validateEditProfileData = (req)=>{
    const data = req.body;
    const AllowedUpdate = ["age","gender","about","Skills","photoUrl","lastName","firstName"];
    const isAllowedupdate = Object.keys(data).every((k)=>AllowedUpdate.includes(k));
    
    return isAllowedupdate;

};

const validateStatus=(req)=>{
    const status = req.params.status;
    const allowedStatus = ["interested","ignored"];
    const isAllowedStatus= allowedStatus.includes(status);

    return isAllowedStatus;
}

module.exports = {validateSignUpApi,validateEditProfileData,validateStatus};