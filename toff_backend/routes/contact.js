var express = require('express');
var router = express.Router();
const mysqlService = require('../services/mysqlService');
const { mailTransporter } = require('../services/mailService');
const { verifyToken } = require('../services/jwtService');

// SEND EMAIL
router.post('/', function (req, res) {
    mysqlService.getActiveEmail((error, result) => {
        if (error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        const mailOptionsContact = {
            from: `"TOFF Kontaktformular" <${result.email}>`,
            to: result.email,
            subject: req.body.firstName + ' ' + req.body.lastName,
            html: `
                <p><strong>Vorname:</strong> ${req.body.firstName}</p>
                <p><strong>Nachname:</strong> ${req.body.lastName}</p>
                <p><strong>E-Mail:</strong> ${req.body.email}</p>
                <p><strong>Firma:</strong> ${req.body.company}</p>
                <p><strong>Anliegen:</strong></p>
                <p>${req.body.contactReason}</p>
            `,
        };

        const activeEmail = {
            email: result.email,
            password: result.password
        }

        mailTransporter(activeEmail).sendMail(mailOptionsContact, function (error, info) {
            if (error) {
                console.error('Error sending contact email:', error);
            } else {
                console.log('Contact-Email sent:', info.response);
            }
        });

        const mailOptionsCustomer = {
            from: `"TOFF Kontaktformular" <${result.email}>`,
            to: req.body.email,
            subject: 'TOFF Kontaktformular',
            html: `
                <p>Hallo ${req.body.firstName} ${req.body.lastName},</p>
                <p>Wir haben Ihr Anliegen erhalten.</p>
                <br>
                <p>Sie bekommen innerhalb von 24 Stunden eine Antwort von uns!</p>
                <br>
                <p>Mit freundlichen Grüßen</p>
                <p>TOFF</p>
                <br>
                <br>
                <p>Ihre eingegebenen Daten:</p>
                <br>
                <p><strong>Vorname:</strong> ${req.body.firstName}</p>
                <p><strong>Nachname:</strong> ${req.body.lastName}</p>
                <p><strong>E-Mail:</strong> ${req.body.email}</p>
                <p><strong>Firma:</strong> ${req.body.company}</p>
                <p><strong>Anliegen:</strong></p>
                <p>${req.body.contactReason}</p>
            `,
        };

        mailTransporter(activeEmail).sendMail(mailOptionsCustomer, function (error, info) {
            if (error) {
                console.error('Error sending customer email:', error);
            } else {
                console.log('Customer-Email sent:', info.response);
            }
        });

        res.status(200).json( {
            message: 'E-Mail sent!'
        });
    });
});

router.post('/createmail', verifyToken, function(req, res) {
   mysqlService.createEmail(req.body.email, (error, results) => {
       if (error) {
           res.status(500).json({ message: 'Internal server error', error: error });
           return;
       }

       res.json(results);
   });
});

router.put('/:id', verifyToken, function (req, res) {
    const updatedItem = req.body.email;

    mysqlService.updateEmail(req.params.id, updatedItem, (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

router.delete('/:id', verifyToken, function(req, res) {
    mysqlService.deleteEmail(req.params.id, (error, results) => {
        if(error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

router.get('/', function(req, res) {
    mysqlService.getEmails((error, results) => {
        if (error) {
            res.status(500).json({ message: 'Internal server error', error: error });
            return;
        }

        res.json(results);
    });
});

module.exports = router;
