const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "lifemeal",
  allowedFormats: ["jpg", "png", "jpeg", "svg", "pdf"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});
const fileUpload = multer({ storage: storage });
module.exports = fileUpload;
