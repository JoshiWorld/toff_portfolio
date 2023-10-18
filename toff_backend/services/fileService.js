const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the directory where uploaded files will be saved
    },
    filename: function (req, file, cb) {
        // Use the current timestamp as a unique file name
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

function deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${err}`);
        } else {
            console.log(`File deleted: ${filePath}`);
        }
    });
}

module.exports = {
    deleteFile,
    upload
}
