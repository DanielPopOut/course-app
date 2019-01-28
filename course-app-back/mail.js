let express = require('express');
let router = express.Router();

let nodemailer = require('nodemailer');
const email_user = "cyrillemarvelmedia@gmail.com";//'uzenze.cm@gmail.com';
const email_pass = "Cyrille@1891";//'julesUzenze';

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email_user,
        pass: email_pass
    }
});

module.exports = {
    sendEmail : function (receiver, subject, content) {
        console.log('email ready to be sent');

        let mailOptions = {
            from: email_user,
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