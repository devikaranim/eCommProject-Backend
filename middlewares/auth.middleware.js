/**
 *  create a mw which checks the req body is proper and correct
 */
const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")
const auth_config = require("../configs.js/auth.config")


const verifySignUpBody = async (req,res,next)=>{
    try{
        //check for name,email,userId-mandatory things
        //check if the user with the same userId is already present
        if(!req.body.name){
            return res.status(400).send({
                message : "failed !! Name was not provided in request body"
            })
        }
        if(!req.body.email){
            return res.status(400).send({
                message : "failed !! Email was not provided in request body"
            })
        }
        if(!req.body.userId){
            return res.status(400).send({
                message : "failed !! USerId was not provided in request body"
            })
        }
        const user = await user_model.findOne({userId:req.body.userId})
        if(user){
            return res.status(400).send({
                message : "failed !! USerId is already present"
            })
        }
        next()
    }catch(err){
        console.log("Error while validating the request body object",err)
        res.status(500).send("Error while validating the request body")
    }
}

const verifySignInBody = (req,res,next)=>{
    if(!req.body.userId){
        return res.status(400).send({
            message : "failed !! userId was not provided in request body"
        })
    }
    if(!req.body.password){
        return res.status(400).send({
            message : "failed !! Password was not provided in request body"
        })
    }
    next()
}

const verifyToken = (req, res, next) => {
    // Check if the token is present in the header
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({
            message: "No token found: unauthorized"
        });
    }

    // Verify the token
    jwt.verify(token, auth_config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized"
            });
        }

        // Find the user based on the token's decoded ID
        const user = await user_model.findOne({ userId : decoded.id }); // Make sure 'id' is used instead of 'Id'
        if (!user) {
            return res.status(400).send({
                message: "Unauthorized: user does not exist"
            });
        }

        // Set the user info in the request body
        req.user = user;

        // Proceed to the next middleware
        next();
    });
};


const isAdmin = (req, res, next) => {
    const user = req.user;  // Correct reference to 'req.user'
    if (user && user.userType === "ADMIN") {
        next();
    } else {
        return res.status(403).send({
            message: "Only admins are allowed to access this endpoint"
        });
    }
};



module.exports = {
    verifySignUpBody : verifySignUpBody,
    verifySignInBody : verifySignInBody,
    verifyToken  : verifyToken,
    isAdmin : isAdmin
}