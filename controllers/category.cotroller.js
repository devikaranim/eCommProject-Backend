/**
 * controller for creating the category
 * POST : localhost:8888/ecomm/api/v1/auth/categories
 * {
    "name" : "Household",
    "descrition" : "This will have all household items"
    }
 */
const category_model = require("../models/category.model")
exports.createNewCategory = async (req,res)=>{
    //read the req body


    // create the category object
    const cat_data = {
        name:req.body.name,
        description : req.body.description
    }

    try{
        //insert into mongodb
        const category  = await category_model.create(cat_data);
        return res.status(201).send(category)
    }catch(err){
        console.log("Error while creating category",err)
        return res.status(500).send({
            message  : "Error while creating category"
        })
    }


    //return the response of the created category
}