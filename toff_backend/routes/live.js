var express = require('express');
var router = express.Router();
const mysqlService = require('../services/mysqlService');
const { verifyToken } = require('../services/jwtService');
const { upload, deleteFile } = require('../services/fileService');

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
    createdItem.isVideo = false;

    if (req.file) {
        console.log('FILE EXISTS');
        const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
        const videoExtensions = ['mp4', 'avi', 'mov', 'mkv'];

        if (videoExtensions.includes(fileExtension)) {
            createdItem.mediaSource = req.file.path;
            createdItem.isVideo = true;
        } else {
            createdItem.imageSource = req.file.path;
            createdItem.isVideo = false;
        }
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
        if(updatedItem.imageSource) deleteFile(updatedItem.imageSource);
        if(updatedItem.mediaSource) deleteFile(updatedItem.mediaSource);

        const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
        const videoExtensions = ['mp4', 'avi', 'mov', 'mkv'];

        if (videoExtensions.includes(fileExtension)) {
            updatedItem.mediaSource = req.file.path;
            updatedItem.isVideo = true;
            updatedItem.imageSource = null;
        } else {
            updatedItem.imageSource = req.file.path;
            updatedItem.isVideo = false;
            updatedItem.mediaSource = null;
        }
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