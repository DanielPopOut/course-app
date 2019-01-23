let express = require('express');
let router = express.Router();

let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    // host: 'smtp.gmail.com',
    // port: 465,
    service: 'gmail',
    auth: {
        user: 'uzenze.cm@gmail.com',
        pass: 'julesUzenze',
        /*
        user: 'cyrillemarvelmedia@gmail.com',
        pass: 'Cyrille@1891',*/
        // type: 'OAuth2',
    }
});

module.exports = {
    sendEmail : function (receiver, subject, content) {
        console.log('email ready to be sent');

        let mailOptions = {
            from: 'uzenze.cm@gmail.com',
            to: receiver,
            subject: subject,
            text: content
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return error;
            } else {
                console.log('Email sent: ' + info.response);
                console.log('info', info);
                return info.response;
            }
        });
    },


};