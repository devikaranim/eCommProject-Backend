/**
 *  POST : localhost:8888/ecomm/api/v1/auth/signup
 * Intercept the request
 */

const authController = require("../controllers/auth.controller")
const authMW = require("../middlewares/auth.middleware")


module.exports = (app)=>{
    app.post("/ecomm/api/v1/auth/signup",[authMW.verifySignUpBody],authController.signup)

    /**
     * route for
     * POST call 127.0.0.1:8888/ecomm/api/v1/auth/signin
     */
    app.post("/ecomm/api/v1/auth/signin",[authMW.verifySignInBody],authController.signin)
}   