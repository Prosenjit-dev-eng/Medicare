import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

// configure cloudinary
cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    }
);

// To upload files from cloudinary
export async function uploadToCloudinary(filepath, folder="Doctor") {
    try{
        const result = await cloudinary.uploader.upload(filepath, {
            folder,
            resource_type: "image"
        });

        // Remove the local file after upload
        fs.unlinkSync(filepath);
        return result;
    }
    catch(err){
        console.error("Cloudinary upload error: ", err);
        throw err;
    }
    
}
// To delete an image that is present in cloudinary if user removes from the UI 
export async function deleteFromCloudinary(params) {
    try{
        if (!publicId){
            return;
        }
        await cloudinary.uploader.destroy(publicId);
    }
    catch(err){
        console.error("Cloudinary delete error: ", err);
        throw err;
    }
}


export default cloudinary;