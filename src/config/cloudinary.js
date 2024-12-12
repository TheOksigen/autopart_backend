const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (base64Image) => {
    try {
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: 'autoparts',
            resource_type: 'auto'
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

const deleteFromCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) return;
        const publicId = 'autoparts/' + imageUrl.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
