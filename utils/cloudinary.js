const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.COULD_NAME,
    api_key: process.env.CLOUD_KEYS,
    api_secret: process.env.CLOUD_KEY_SECRET
});

module.exports = cloudinary