import dotenv from 'dotenv';

// 👇 add path to the actual env file
dotenv.config({ path: './api/.env' });



import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


//console.log("🔍 Cloudinary Env:", {
 // name: process.env.CLOUDINARY_CLOUD_NAME,
 // key: process.env.CLOUDINARY_API_KEY,
 // secret: process.env.CLOUDINARY_API_SECRET ? '✅ LOADED' : '❌ MISSING',
//});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'real-estate',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

export default cloudinary;