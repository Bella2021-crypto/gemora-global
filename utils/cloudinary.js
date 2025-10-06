const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.drbkamqdr,
  api_key: process.env.629812938311984,
  api_secret: process.env.WMePd9QQOnRnBirJIR3gavgy5FI,
});

module.exports = cloudinary;
