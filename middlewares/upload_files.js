const multer = require('multer');

// Define the storage configuration for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Define the directory to store the uploaded files
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
})

// Create a Multer instance
const upload = multer({ storage: storage,
  limits: {
    fileSize: 1024 * 1024, // Maximum file size in bytes (e.g., 1MB)
    files: 1, // Maximum number of files allowed to be uploaded
  },
  fileFilter: function (req, file, cb) {
    // Specify file type validation or restrictions
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
      return cb(new Error('Only JPEG/JPG or PNG files are allowed.'));
    }
    cb(null, true);
  },});


module.exports = upload