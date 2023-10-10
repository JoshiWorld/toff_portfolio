var express = require('express');
var router = express.Router();
const mysqlService = require('../services/mysqlService');
const jwt = require('jsonwebtoken');

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

router.put('/:id', function(req, res) {
   const token = req.body.token;

    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
        if(error) {
            res.status(401).json({ message: 'Unauthorized' });
        } else {
            mysqlService.updateLiveBlog(req.params.id, (error, results) => {
                if(error) {
                    res.status(500).json({ message: 'Internal server error', error: error });
                    return;
                }

                res.json(results);
            });
        }
    });
});

module.exports = router;