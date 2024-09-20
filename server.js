/**
 * This is the staring file of the project
 */

const mongoose  = require("mongoose")
const express = require("express")
const app = express()
const server_config = require("./configs.js/server.config")
const db_config = require("./configs.js/db.config")
const user_model = require("./models/user.model")
const bcrypt=require("bcryptjs")
app.use(express.json())

/**
 * create an admin user at the starting of the application 
 * if not already present
 */
// Connect with the database
mongoose.connect(db_config.DB_URL)

const db=mongoose.connection

db.on("error",()=>{
    console.log("Error while connecting to the mongodb")
})

db.once("open",()=>{
    console.log("Connected to Mongodb")
    init()
})


async function init(){
    try{
        let user = await user_model.findOne({userType : "ADMIN"})
        if(user) {
            console.log("Admin is already present")
            return
        }
    }catch(err){
        console.log("Error while reading data",err);
    }
    try{
        user = await user_model.create({
            name:"Devi",
            userId:"admin",
            password:bcrypt.hashSync("Welcome1",8),
            email:"devikam1010@gmail.com",
            userType:"ADMIN"
        })
        console.log("Admin created",user)

    }catch(err){
        console.log("Error while creating admin",err);
    }
}

/**
 * stich the route to the server
 */
require("./routes/auth.routes")(app)
require("./routes/category.routes")(app)

/**
 * Starting the server
 */
app.listen(server_config.PORT, ()=>{
    console.log("Server started at ",server_config.PORT)
})