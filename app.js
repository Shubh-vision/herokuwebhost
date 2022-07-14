const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');



const app = express();

app.use(cookieParser());




dotenv.config({path: "./config.env"});
require("./db/conn");

app.use(express.json());

const User = require("./model/userSchema");


//link router files
app.use(require("./router/auth"));



const PORT = process.env.PORT || 5000;





// app.get("/", function(req, res){
//     res.send("Hello World from server appjs")
// });

// app.get("/about", function(req, res){
//     res.send("Hello about")
// });

// app.get("/contact", function(req, res){
//     res.send("Hello contact")
// });

app.get("/signin", function(req, res){
    res.send("Hello signin")
});

app.get("/signup", function(req, res){
    res.send("Hello signup")
});


if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"))
}


app.listen(PORT, function(){
    console.log("Successfully connected on ${PORT}");
});
