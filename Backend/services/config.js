const cloudinary=require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
})
console.log(process.env.CLOUD_NAME,process.env.API_KEY,process.env.API_SECRET);


exports.uploadToCloudinary=async(file,folder="")=>{
    try {
        const result=await cloudinary.uploader.upload(file,{
            folder,
        })
            return ({success:true,url:result.secure_url,public_id:result.public_id})


    } catch (error) {
        console.error("Error uploading to cloudinary",error.message);
        return ({success:false,message:"Error uploading to cloudinary",error:error.message})
    }
}