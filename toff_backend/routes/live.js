var express = require('express');
var router = express.Router();
const mysqlService = require('../services/mysqlService');
const { verifyToken } = require('../services/jwtService');

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


/* GET users listing. */
router.get('/', function(req, res) {
    mysqlService.getLiveBlogs((error, results) => {
        if (error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

router.post('/create', verifyToken, upload.single('image'), function(req, res) {
    const createdItem = JSON.parse(req.body.liveblog);

    if (req.file) {
        const imageSource = req.file.path;
        createdItem.imageSource = imageSource;
    }

    mysqlService.createLiveBlog(createdItem, (error, results) => {
        if(error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

router.delete('/:id', verifyToken, function(req, res) {
    mysqlService.deleteLiveBlog(req.params.id, (error, results) => {
        if(error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

router.put('/:id', verifyToken,  upload.single('image'), function (req, res) {
    const updatedItem = JSON.parse(req.body.item);

    if (req.file) {
        const imageSource = req.file.path;

        updatedItem.imageSource = imageSource;
    }

    mysqlService.updateLiveBlog(req.params.id, updatedItem, (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});


module.exports = router;