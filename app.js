// Level 1 Simple
// Level 2 mongoose-encryption --> nothing to do with routes. It automatically encrypt on .save() and decrypt on find(). Just add Plugin to ur schema just before declaring the model
// Level 3 Hashing Use md5 or anything else to hash

//jshint esversion:6
require('dotenv').config()
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const saltRounds = 5

const app = express()

app.use(express.static("public"))
app.set('view engine' , 'ejs')
app.use(bodyParser.urlencoded({extended : true}))


mongoose.connect("mongodb://localhost:27017/userDB" , {useNewUrlParser: true})

const userSchema = new mongoose.Schema({
    email : String,
    password : String
})


// userSchema.plugin(encrypt, { secret : process.env.SECRET , encryptedFields : ["password"] });

const User = new mongoose.model("user" , userSchema)



app.get("/" , (req,res) =>{
    res.render("home")
})

app.get("/login" , (req,res) =>{
    res.render("login")
})
app.get("/register" , (req,res) =>{
    res.render("register")
})

app.post("/login" , (req,res) =>{
    User.findOne({email : req.body.username} , (err , foundUser) =>{
        if(!foundUser){
            console.log("User Not registered")
        }else{
            bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                if (err){
                    res.send(err)
                }
                else if (result){
                    res.render("secrets" , {pass : req.body.password})
                }else{
                    console.log("Credentials Dont Match")
                }
            });
        }
    })
})

app.post("/register" , (req,res) =>{

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if (err) {
            res.send(err)
        }else{
            const newUser = new User({
                email : req.body.username,
                password : hash
            })
            newUser.save((err) =>{
                if(err){
                    res.send(err)
                }else{
                    res.render("secrets")
                }
            })
        }
    });

    
})

app.listen(3000 , () =>{
    console.log("App is running on port 3000")
})