var express = require('express');
var router = express.Router();
const mysqlService = require('../services/mysqlService');
const { mailTransporter } = require('../services/mailService');

router.post('/', function (req, res) {
    mysqlService.createStats(req.body, (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        const mailOptions = {
            from: process.env.MAIL_SENDER_MAIL,
            to: req.body.email,
            subject: 'TOFF Kontaktformular',
            text: req.body.contactReason,
        };

        mailTransporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.json(results);
    });
});

module.exports = router;
