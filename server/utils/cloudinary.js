import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    console.log("File uploaded to Cloudinary", response.url);
    
    // Use async fs.unlink to avoid blocking
    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Error removing file:", err);
    });

    return response.url;
  } catch (error) {
    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Error removing file:", err);
    });
    console.log(error);
    throw error;
  }
};

export { uploadOnCloudinary };
