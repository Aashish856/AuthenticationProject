//jshint esversion:6
require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const exp = require('constants')
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption')

const app = express()
app.use(express.static("public"))
app.set('view engine' , 'ejs')
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    email : String,
    password : String
})

userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["password"]} );

const USER = new mongoose.model('User',userSchema);

app.get("/" , (req , res) =>{
    res.render('home')
})
app.get("/register" , (req , res) =>{
    res.render('register')
})
app.get("/login" , (req , res) =>{
    res.render('login')
})

app.post("/login" , (req,res) =>{

    const username = req.body.username
    const password = req.body.password

    USER.findOne({email : username} , (err , foundUser) =>{
        if (err){
            console.log(err)
        }
        else{
            if (foundUser.password == password){
                console.log(username + " Just Loged In")
                res.render("secrets")
            }
            else{
                console.log("Invalid credentials");
            }
            
        }
    })

})

app.post('/register' , (req,res)=>{

    const newUser = new USER({
        email : req.body.username,
        password : req.body.password
    })

    newUser.save((err)=>{
        if (err){
        console.log(err)


        }
        else{
            res.render('secrets')
        }
    })
    
})

app.listen(3000 , (req,res) =>{
    console.log("App is started on port 3000")
})