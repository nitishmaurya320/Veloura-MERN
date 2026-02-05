const express=require("express")
const Product=require("../models/product")

  
const {protect,admin}=require("../middleware/authMiddleware")

const router=express.Router()

//@route POST /api/products
//@desc Create a new product
//access private/admin

 router.post("/",protect,admin,async (req,res)=>{
 
    try{
           const {
        name,
        description,
        price,
        discountPrice,
        countInStock,
        category,
        brand,
        sizes,
        colors,
        collections,
        material,
        gender,
        images,
        isFeatured,
        isPublished,
        tags,
        dimesions,
        weight,
        sku,

} = req.body;
        const product=new Product( {
        name,
        description,
        price,
        discountPrice,
        countInStock,
        category,
        brand,
        sizes,
        colors,
        collections,
        material,
        gender,
        images,
        isFeatured,
        isPublished,
        tags,
        dimesions,
        weight,
        sku,
        user:req.user._id
    
        })
        const createdProduct=await product.save()
        res.status(201).json(createdProduct)

    }
    catch(err){
        console.log(err)
        res.status(500).send("server error")


    }


 })

 //@route PUT api/products/:id  

 router.put("/:id",protect,admin,async (req,res)=>{
    try{
        const {
                name,
                description,
                price,
                discountPrice,
                countInStock,
                category,
                brand,
                sizes,
                colors,
                collections,
                material,
                gender,
                images,
                isFeatured,
                isPublished,
                tags,
                dimesions,
                weight,
                sku
                } = req.body;

        const product=await Product.findById(req.params.id)
        if(product){
            product.name=name||product.name
            product.description=description||product.description
            product.price=price||product.price
            product.discountPrice=discountPrice||product.discountPrice
            product.countInStock=countInStock||product.countInStock
            product.category=category||product.category
            product.brand=brand||product.brand
            product.sizes=sizes||product.sizes
            product.colors=colors||product.colors
            product.collections=collections||product.collections
            product.material=material||product.material
            product.gender=gender||product.gender
            product.images=images||product.images
            product.isFeatured=isFeatured!=undefined ? isFeatured:product.isFeatured
            product.isPublished=isPublished!=undefined?isPublished:product.isPublished
            product.tags=tags||product.tags
            product.dimesions=dimesions||product.dimesions
            product.weight=weight||product.weight
            product.sku=sku||product.sku

            const updatedProduct=await product.save()
            
            res.status(200).json({updatedProduct})
         
        }
        else{
            res.status(404).json({message: "Product not found"})
        }
    }
    catch(err){ 
            console.log(err)
            res.status(500),send("Server error")
    }
 })

 //@routes DELETE api/products/:id
 //delete a product from database

 router.delete("/:id",protect,admin,async (req,res)=>{
    try{
        const product=await Product.findById(req.params.id)
        if(product){
            await product.deleteOne();
            res.json({message:"product removed"})
        }
        else{
            res.status(404).json({message:"Product not found"})
        }
        
    }
    catch(err){
        console.log(err)
        res.status(500).send("server error")
    }
 })

 //@routes GET api/Products

 router.get("/",async (req,res)=>{
        try{
            const {collection,size,color,gender,
                minPrice,maxPrice ,sortBy,search,
                category,material,brand,limit}=req.query   
                
                let query={};
                //filter

                if(collection&&collection.toLocaleLowerCase()!=="all"){
                    query.collections=collection
                }
                if(category&&category.toLocaleLowerCase()!=="all"){
                    query.category=category;
                }
                if(material){
                    query.material={$in:material.split(",")}
                }
                if(brand){
                    query.brand={$in:brand.split(",")}
                }
                if(size){
                    query.sizes={$in:size.split(",")}
                }
                if(color){
                    query.colors={$in:[color]}
                }
                if(gender){
                    query.gender=gender
                }
                if(minPrice||maxPrice){
                    query.price={}
                    if(minPrice) query.price.$gte=Number(minPrice)
                    if(maxPrice) query.price.$lte=Number(maxPrice)

                }
                if(search){
                    query.$or=[
                        {name:{$regex: search,$options:"i"}},
                        {description:{$regex: search,$options:"i"}}
                        

                    ]
                }
             
         //sort login
         let sort={};
        if(sortBy){
            switch(sortBy){
                case "PriceAsc":
                sort={price:1}
                 break;    
                case "PriceDesc":
                sort={price:-1}
                break;
                case "Popularity":
                sort={rating:-1};
                break;
                default:
                    break

            }
            
        }
        //fetch products and apply sorting and limit
        let products=await Product.find(query).sort(sort).limit(Number(limit)||0)
        res.json(products)

                
        }

      
        catch(err){
            console.log("err",err)
            res.status(500).json("server error")

        }
 })


  //@routes api/products/best-seller
 //@desc Retrieve the product with highest rating

 router.get("/best-seller",async (req,res)=>{
    try{
        const bestSeller =await Product.findOne().sort({rating:-1})
        if(bestSeller){
            res.json(bestSeller)
        }
        else{
            res.status(404).json({message: "No best seller found"})
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json( "Server error")
        
    }
 })

 //@routes api/products/new-arrivals

 router.get("/new-arrivals",async (req,res)=>{
    try{
        const newArrivals=await Product.find().sort({createdAt: -1}).limit(8);
        res.json({newArrivals})
    }
    catch(err){
        console.log(err)
        res.status(500).send("Server error")

    }
    
 })

 //@routes api/products/:id

 router.get("/:id",async (req,res)=>{
    let product=await Product.findById(req.params.id)
        try{
            res.json({product})
        }
        catch(err){
            res.status(500).json(err)
        }
    res.json
 })
 

 //@routes api/products/similar/:id

 router.get("/similar/:id",async (req,res)=>{
    const {id}=req.params
    try{
        const product=await Product.findById(id);
        if(!product){
            return res.status(404).json({message:"Product not found"})


        }
        const similarProducts=await Product.find({
            _id:{$ne:id}, //exclude current product id
            gender:product.gender,
            category:product.category,

        }).limit(4)

        res.json(similarProducts)
    }
    catch(err){
        console.log(err)
        res.status(500).send("server error")

    }
 })

 


 module.exports=router