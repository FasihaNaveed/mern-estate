import dotenv from 'dotenv';
dotenv.config({ path: './api/.env' }); // Ensure this matches your actual .env location

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Setup cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup multer-cloudinary storage
export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'real-estate',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

export default cloudinary;
