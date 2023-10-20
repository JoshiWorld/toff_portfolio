var express = require('express');
var router = express.Router();
const mysqlService = require('../services/mysqlService');
const { mailTransporter } = require('../services/mailService');
const { verifyToken } = require('../services/jwtService');

router.post('/', function (req, res) {
    mysqlService.getActiveEmail((error, result) => {
        if (error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        const mailOptions = {
            from: result.email,
            to: req.body.email,
            subject: 'TOFF Kontaktformular',
            text: req.body.contactReason,
        };

        const activeEmail = {
            email: result.email,
            password: result.password
        }

        mailTransporter(activeEmail).sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(200).json( {
            message: 'E-Mail sent!'
        });
    });
});

router.post('/createmail', verifyToken, function(req, res) {
   mysqlService.createEmail(req.body, (error, results) => {
       if (error) {
           res.status(500).json({ message: 'Internal server error', error: error });
           return;
       }

       res.json(results);
   });
});

module.exports = router;
