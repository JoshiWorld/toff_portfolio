var express = require('express');
var router = express.Router();
const mysqlService = require('../services/mysqlService');
const { verifyToken } = require('../services/jwtService');

router.get('/', function(req, res) {
    mysqlService.getDeals((error, results) => {
        if (error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

router.post('/create', verifyToken, function(req, res) {
    mysqlService.createDeal(req.body.deal, (error, results) => {
        if(error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

router.put('/:id', verifyToken, function (req, res) {
    const updatedItem = req.body.deal;

    mysqlService.updateDeal(req.params.id, updatedItem, (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

router.delete('/:id', verifyToken, function(req, res) {
    mysqlService.deleteDeal(req.params.id, (error, results) => {
        if(error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

router.post('/song/create', verifyToken, function(req, res) {
    mysqlService.createDealSong(req.body.deal_song, (error, results) => {
        if(error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

router.put('/song/:id', verifyToken, function (req, res) {
    const updatedItem = req.body.deal_song;

    mysqlService.updateDealSong(req.params.id, updatedItem, (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

router.get('/song/', function(req, res) {
    mysqlService.getDealSong((error, results) => {
        if (error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});



module.exports = router;