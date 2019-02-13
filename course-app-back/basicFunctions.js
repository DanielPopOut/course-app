let express = require('express');
let router = express.Router();

const generateToken = function (user) {
    let payload = {...user};
    let secret = 'fakekey';
    let options = {
        expiresIn: 60 * 60,
        //algorithm:'RS256'
    };
    let token = jwt.sign(payload, secret, options);
    return token;
};
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