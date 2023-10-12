var express = require('express');
var router = express.Router();
const mysqlService = require('../services/mysqlService');
const { verifyToken } = require('../services/jwtService');

router.get('/', function(req, res) {
    mysqlService.getStats((error, results) => {
        if (error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

router.post('/create', verifyToken, function(req, res) {
    mysqlService.createStats(req.body.stats, (error, results) => {
        if(error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

router.put('/:id', verifyToken, function (req, res) {
    const updatedItem = JSON.parse(req.body.item);

    mysqlService.updateStats(req.params.id, updatedItem, (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

router.delete('/:id', verifyToken, function(req, res) {
    mysqlService.deleteStats(req.params.id, (error, results) => {
        if(error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

module.exports = router;