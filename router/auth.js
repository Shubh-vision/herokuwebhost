const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); 
const authenticate = require("../middleware/authenticate");

require("../db/conn");
const User = require("../model/userSchema");

router.get("/", (req, res)=> {
    res.send("Hello world from the server router js");
});


//using Promises::

// router.post("/register", (req,res)=> {

//     const {name, email, phone, work, password, cpassword} = req.body;

//     if(!name || !email || !phone || !work || !password || !cpassword){
//         return res.status(422).json({error: "Please fill the field"});
//     }

//     User.findOne({email:email})
//       .then((userExist) => {
//         if(userExist){
//             return res.status(422).json({error: "email already exist"});

//         }
//         const user = new User({name, email, phone, work, password, cpassword});

//         user.save().then(()=> {
//             res.status(201).json({message: "User registered successfully"});
//         }).catch((err)=> res.status(500).json({error: "Failed to registered"}));
//     }).catch(err => {console.log(err);});
   
// });


//Asyn - await ::-

router.post("/register", async(req,res)=> {

    const {name, email, phone, work, password, cpassword} = req.body;

    if(!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error: "Please fill the field"});
    }

    try {
        const userExist = await User.findOne({email:email});

      
        if(userExist){
            return res.status(422).json({error: "email already exist"});
        }else if (password != cpassword){

            return res.status(422).json({error: "password are not matching"});
        }else {
            const user = new User({name, email, phone, work, password, cpassword});
            const userRegister = await user.save();
        
        if(userRegister){
            res.status(201).json({message: "User registered successfully"});


        }else {
            res.status(500).json({error: "Failed to registered"});

        }
        }
    } catch(err) {
        console.log(err);
    }

    
   
});


//Login route

router.post("/signin", async(req, res)=> {
    // console.log(req.body);
    // res.json({message: "Awesome"});

    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({error: "Invalid credentials"});
        }

        const userLogin = await User.findOne({email: email});

        if(userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });


        console.log(userLogin);

        if(!isMatch){
            res.status(400).json({error: "Invalid credentials"});
        }else {
            res.json({message: "User singin Successfully"});

        }

        }else {
            res.status(400).json({error: "Invalid credentials"});

        }

        

    }catch(err){
        console.log(err);
    }

});

//Aboutus page
router.get("/about", authenticate,(req, res)=>{
    console.log("Hello My About");
    res.send(req.rootUser);

});

//get user data for contact us page
router.get("/getData", authenticate, (req, res)=> {
    console.log("Hello My About");
    res.send(req.rootUser);
});


//ContactUs page
router.post("/contact",authenticate,  async (req, res) => {

try{
    const {name, email, phone, message} = req.body;

    if(!name || !email || !phone || !message){
        console.log("error in contact form");
        return res.json({error: "Plz fill the contact form"});

    }

    const userContact = await User.findOne({_id: req.userID});

    if(userContact){
        const userMessage = await userContact.addMessage(name,email,phone,message);
        await userContact.save();
        res.status(201).json({message: "User contact successfully"});
    }

}catch(err){
    console.log(err);
}

});


//Logout page
router.get("/logout", authenticate,(req, res)=>{
    console.log("Hello My logout");
    res.clearCookie("jwtoken", {path : '/'});
    res.status(200).send("User Logout");

});



module.exports = router;