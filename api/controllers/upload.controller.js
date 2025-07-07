import cloudinary from '../utils/cloudinary.js';

export const uploadImage = async (req, res, next) => {
  try {
    const fileStr = req.body.image; // image as base64 string
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'profile_pics', // optional folder in cloudinary
    });
    res.status(200).json({ url: uploadedResponse.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed' });
  }
};
