const express = require("express");

const app = express();

app.get("/",(req,res)=>{
    res.send("Hello from the server's dashboard!")
});
app.get("/hello",(req,res)=>{
    res.send("Hello hello hello!")
});
app.get("/test",(req,res)=>{
    res.send("namaste from the server test side!")
});

app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000....");
    
})