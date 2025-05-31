const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Make sure upload folder exists
const uploadPath = path.join(__dirname, '..', 'uploads', 'CSD');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // Save inside uploads/CSD
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
