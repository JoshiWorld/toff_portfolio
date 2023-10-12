var express = require('express');
var router = express.Router();
const mysqlService = require('../services/mysqlService');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { Blob } = require('blob');

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

router.post('/create', function(req, res) {
    const token = req.body.token;

    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
        if (error) {
            // If verification fails, the token is invalid or expired
            res.status(401).json({ message: 'Unauthorized' });
        } else {
            mysqlService.createLiveBlog(req.body.liveblog, (error, results) => {
                if(error) {
                    res.status(500).json({ message: 'Internal server error', error: error });
                    return;
                }

                res.json(results);
            });
        }
    });
});

router.delete('/:id', function(req, res) {
   const token = req.body.token;

   jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
       if(error) {
           res.status(401).json({ message: 'Unauthorized' });
       } else {
           mysqlService.deleteLiveBlog(req.params.id, (error, results) => {
              if(error) {
                  res.status(500).json({ message: 'Internal server error', error: error });
                  return;
              }

              res.json(results);
           });
       }
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

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
        if (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        next();
    });
}


module.exports = router;