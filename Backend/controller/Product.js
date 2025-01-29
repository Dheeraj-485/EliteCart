const { Product } = require('../model/Product');
const { uploadToCloudinary } = require('../services/config');
const path=require('path')

exports.createProduct = async (req, res) => {
  // this product we have to get from API body
  // if(!req.files || !req.files.thumbnail){
  //   return res.status(400).json({success:false, message:" image is mandatory"})

  // }
  const {thumbnail}=req.files;
const allowedFormats=["image/png","image/jpg","image/webp"];
if(!allowedFormats.includes(thumbnail.mimetype)){
  return res.status(401).json({message: "Invalid file type"})

}
if (!thumbnail.tempFilePath) {
  return res.status(500).json({ message: 'Temporary file path not found for thumbnail.' });
}
// const tempPath = path.join(__dirname, 'uploads', thumbnail.name); // Adjust the 'uploads' path as needed
//     await thumbnail.mv(tempPath);
// const path = require('path');
const normalizedFilePath = path.normalize(thumbnail.tempFilePath); // Normalize the path
console.log('Normalized file path:', normalizedFilePath);

// const uploadResult=await uploadToCloudinary(thumbnail.tempFilePath,"ecommerce");
const uploadResult=await uploadToCloudinary(normalizedFilePath,"Ecom");
console.log("thumbnail object",uploadResult);
console.log("thumbnail tempfiletype",normalizedFilePath);
// console.log("thumbnail tempfiletype",thumbnail.tempFilePath);

// console.log();

if(!uploadResult.success){
  return res.status(400).json({success:false, message:`Image upload failed: ${uploadResult.error}`})

}
  const product = new Product({...req.body,thumbnail:uploadResult.url});
  product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let condition = {}
  if(!req.query.admin){
      condition.deleted = {$ne:true}
  }
  
  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  console.log(req.query.category);

  if (req.query.category) {
    query = query.find({ category: {$in:req.query.category.split(',')} });
    totalProductsQuery = totalProductsQuery.find({
      category: {$in:req.query.category.split(',')},
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: {$in:req.query.brand.split(',')} });
    totalProductsQuery = totalProductsQuery.find({ brand: {$in:req.query.brand.split(',') }});
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.countDocuments().exec();
  // const totalDocs=await query.exec()
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set('X-Total-Count', totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {new:true});
    product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
    const updatedProduct = await product.save()
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};


