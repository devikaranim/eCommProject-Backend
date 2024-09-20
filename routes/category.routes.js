/**
 * POST : localhost:8888/ecomm/api/v1/auth/categories
 */
const categoryController = require("../controllers/category.cotroller")
const auth_mw=require("../middlewares/auth.middleware")

module.exports = (app)=>{
    app.post("/ecomm/api/v1/auth/categories",[auth_mw.verifyToken,auth_mw.isAdmin],categoryController.createNewCategory)
}