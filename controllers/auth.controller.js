/**
 * login to register a user
 */
const bcrypt = require("bcryptjs")
const user_model = require("../models/user.model")
const jwt= require("jsonwebtoken")
const secret = require("../configs.js/auth.config")
exports.signup= async(req,res)=>{
    /**
     * logic to create a user
     */
    //1. Read the request body
    const req_body = req.body

    //2.Insert the data in the user Collections in mongodb
    const userObj={
        name:req_body.name,
        userId:req_body.userId,
        email : req_body.email,
        userType : req_body.userType,
        password : bcrypt.hashSync(req_body.password,8)
    }

    try{
        const user_created = await user_model.create(userObj)
        const res_obj ={
            name:user_created.name,
            userId:user_created.userId,
            email : user_created.email,
            userType : user_created.userType,
            createdAt : user_created.createdAt,
            updatedAt : user_created.updatedAt
        }
        res.status(201).send(res_obj)
    }catch(err){
        console.log("Error while registering the user",err)
        res.status(500).send({
            message : "Error while registering to user"
        })
    }

    //3. Return the reponse back to the user
}

/**
 * Logic for login
 */
exports.signin= async(req,res)=>{
    //check if the userId is present
    const user = await user_model.findOne({userId:req.body.userId})
    if(user==null){
        return res.status(400).send({
            message:"This is not a valid userId"
        })
    }
    // chceck if password is correct
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password)
    if(!isPasswordValid){
        return res.status(401).send({
            message:"This is a wrong password"
        })
    }
    
    //using jwt we will create the access token with a give TTL and return
    const token=jwt.sign({id:user.id},secret.secret,{
        expiresIn : 120  //120sec
    })

    res.status(200).send({
        name:user.name,
        userId:user.userId,
        email:user.email,
        userType:user.userType,
        accessToken:token           
    })
}