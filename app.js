require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
//const md5 = require("md5");--md5 algorithm changed to bcrypt algorithm
const bcrypt = require("bcrypt");

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine' , 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser : true ,useUnifiedTopology : true});

const userSchema = new mongoose.Schema({   // mangoose schema class's object
  email : String,
  password : String
});

//const secret = process.env.SECRET; //using the string to encrypt our database //we can use longstring or 32byte encryption key and 64byte signing key
//userSchema.plugin(encrypt ,{secret : secret ,encryptedFields:["password"]});---------------encryptionmethod

const User = mongoose.model("User" ,userSchema);

const saltRounds = 5;

app.get("/" ,function(req ,res){
  res.render("home");
});

app.get("/login" ,function(req ,res){
  res.render("login");
});

app.get("/register" ,function(req ,res){
  res.render("register");
});

app.post("/register" ,function(req ,res){
  // const username = req.body.username;--not necessary for bcrypt write it directly inside function
  // const password = req.body.password;--not necessary for bcrypt write it directly inside function

  bcrypt.hash(req.body.password ,saltRounds ,function(err, hash) {
    const newUser = new User({
      email    : req.body.username,
      password : hash
      // password: md5(req.body.password)-------md5  algorithm hashing method
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.render("secrets")
      }
    });
});
});

app.post("/login" ,function(req ,res){
  // const username = req.body.username;--not necessary for bcrypt write it directly inside function
  // const password = req.body.password;--not necessary for bcrypt write it directly inside function
  // const password = md5(req.body.password);--------md5 algorithm hashing method
  User.findOne({email : req.body.username},function(err ,foundItems){
    if(err){
      console.log(err);
    }else {
      if(foundItems){
        //if(foundItems.password === password){---------checking entered password against stored password--security-1
        bcrypt.compare(req.body.password ,foundItems.password ,function(err, result) {
        if(result === true){
          res.render("secrets")
        }// }else{
        //   res.write("enter correct password");
        //   res.send();
        // }
      })
};
}
})
})




app.listen(3000 ,function(){
  console.log("server started");
})
// const userSchema = {   //simple javascript object
//   email : String,
//   password : String
// };
