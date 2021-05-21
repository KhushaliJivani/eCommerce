require("../routes/routes");
const product=require("../models/product.model");
const registerUser=require("../models/user.model");
exports.addProduct=async(req,res)=>{
    try{
        const email=req.body.email;
        const role=req.body.role;
        const file=req.files;
        const price=req.body.price;
        const stock=req.body.stock;
        if(role==="vendor")
        {
            const user=await registerUser.findOne({email:email});
            if(!user){
                res.status(400).send({message:"no user found"})
             }
             else{
                const file=req.files;
                const addProduct=new product({
                    userId: user._id,
                    productName: req.body.pName,
                    productPrice: req.body.price,
                    stock: req.body.stock,
                })
            const productList=await addProduct.save();
                for(var i=0;i<file.length;i++){
                    const data=await product.updateOne({_id:productList._id},{$push:{productImage:file[i].path}});
                }
                res.status(200).send({message:"data stored successfully"});
            }
        }else{
                res.status(400).send({message:"user is not able to add a product"});
            }
        }catch(error){
        res.status(400).send({
            message:"no data store",
            error:error.message,
        })
    }
}
exports.editProduct=async(req,res)=>{
    try{
        const role=req.body.role;
        if(role==="vendor")
        {
            const productId=req.body.id;
            await product.findOne({
                _id:productId
            },function(err,result){
                if(err){
                    res.status(400).send({message:"error",error:err});
                }else{
                    res.status(200).send({message:"product detail",data:result});
                }
            })
        }else{
            res.status(400).send({message:"user must be a vendor to edit a product"});
        }
    }catch(error){
        res.status(400).send({
            message:"no data found",
            error:err.message,
        })
    }
}
exports.editAddProduct=async(req,res)=>{
    try{
        const role=req.body.role;
        const file=req.files;
        if(role==="vendor"){
            const productId=req.body.id;
            const updateProduct=await product.updateOne({_id:productId},{$set:{
                    productName: req.body.pName,
                    productPrice: req.body.price,
                    stock: req.body.stock,
            }});
            for(var i=0;i<file.length;i++){
                const data=await product.updateOne({_id:productId},{$push:{productImage:file[i].path}});
            }
            const findProduct=await product.findOne({_id:productId});
            res.status(200).send({message:"data updated successfully",data:findProduct});
        }else{
            res.status(400).send({
                message:"user must be a vendor to update a product",

            })
        }
    }catch(error){
        res.status(400).send({message:"no data updated",error:error.message});
    }
}
exports.deleteProduct=async(req,res)=>{
    try{
        const role=req.body.role;
        if(role==="vendor")
        {
            const productId=req.body.id;
            await product.deleteOne({_id:productId},function(err,result){
                if(err){
                    res.status(400).send({message:"error",error:err});
                }else{
                    res.status(200).send({message:"product deleted",data:result});
                }
            })
        }else{
            res.status(400).send({message:"user must be a vendor to delete a product"});
        }
    }catch(error){
        res.status(400).send({
            message:"no data found",
            error:err.message,
        })
    }
}

exports.displayProduct=async(req,res)=>{
    try{
        const role=req.body.role;
        if(role==="vendor")
        {
            const email=req.body.email;
            const user=await registerUser.findOne({email:email});
            const userId=user._id;
            await product.find({userId},function(err,result){
                if(err){
                    res.status(400).send({message:"no product available for this user",error:err.message});
                }else{
                    res.status(200).send({message:"product",data:result});
                }
            });
        }else{
            res.status(400).send({message:"user must be a vendor to display product"});
        }
    }catch(error){
        res.status(400).send({message:"no data found",error:error.message});
    }
}


