require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};


const Users = require('./model/user')

//CORS
app.use(function (req, res, next) {
    console.log("CORS");
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

//get/post/put/delete
app.get('/user/:email', async (req, res) => {
    // console.log("CReate this user Updated: ", req.params.email)
    let userDb = await Users.find({email:req.params.email})

    if (userDb.length < 1){
        userDb = Users.create({email: req.params.email, tracking: []})
        console.log("made userDB")
    }
    console.log(userDb)
    res.status(200).send(userDb);
})


app.put('/:email', (req, res) => {
    console.log(typeof req.body.state)
    console.log(req.params.email)
   
    Users.findOneAndUpdate({ email: req.params.email }, {$push: { tracking: req.body.state }},{new: true,}, (err,doc ) => {
        if(err){
            console.log(err)
        }
    } ).clone().then(result => res.status(200).send(result))
    // console.log("PUT:", result)/

})

app.delete('/delete/:email/:state', (req, res) => {
    console.log("DELETE HIT")
    console.log(req.params)
    Users.updateOne({email: req.params.email}, {$pull: { tracking:req.params.state } } ).then(result => console.log(result))
  
})



mongoose.connect(process.env.MONGODB_URI, mongooseOptions).then(() => {
    console.log("Database up and running!");
    server.listen(process.env.PORT, () =>
        console.log(`Server up on ${process.env.PORT}`)
    );
});