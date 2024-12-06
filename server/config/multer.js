const multer = require("multer");
const path = require("path");
// const path = require("../../client/public/uploads/ExpanceImg");

// Helper function to check if the file is an image
const imageFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|jfif/; // Allowed image file extensions
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase()); // Check file extension
    const mimeType = fileTypes.test(file.mimetype); // Check file mime type

    if (extName && mimeType) {
        cb(null, true); // File is an image, accept it
    } else {
        req.fileValidationError = "Only images are allowed!";
        cb(new Error("Only images are allowed!"), false); // Reject the file
    }
};

// ============== User Image Upload (Uupload) ==============
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../client/public/uploads/ExpanceImg'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Adds timestamp to avoid file name collisions
    }
});


// Create upload instances for each with the image filter
const upload = multer({ 
    storage: Storage,
    fileFilter: imageFilter // Apply image filter
});


// Export  configurations
module.exports = {upload};


// // req.file contains {
// //     fieldname: 'userimage',
// //     originalname: 'task done at home.PNG',
// //     encoding: '7bit',
// //     mimetype: 'image/png',
// //     destination: 'C:\\Users\\RC\\OneDrive\\Videos\\EventSphereManagement\\backend\\uploads\\userProfiles',
// //     filename: '1725000239570.PNG',
// //     path: 'C:\\Users\\RC\\OneDrive\\Videos\\EventSphereManagement\\backend\\uploads\\userProfiles\\1725000239570.PNG',
// //     size: 28808
// //   }
