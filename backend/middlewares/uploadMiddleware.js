
const multer = require('multer');
const path = require('path');

// Set storage engine.multer helps you manage file storage
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Check file type. this is very imprtant. take note
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|webp/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Initialize the  upload here
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // this means 2MB max
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array('images', 5);

module.exports = upload;
