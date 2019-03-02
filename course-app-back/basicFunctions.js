let express = require('express');
let router = express.Router();

module.exports = {
    generateToken : function (user) {
        let payload = {...user};
        let secret = 'fakekey';
        let options = {
            expiresIn: 60 * 60,
            //algorithm:'RS256'
        };
        let token = jwt.sign(payload, secret, options);
        return token;
    },
};