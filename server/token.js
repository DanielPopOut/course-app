const jwt = require('jsonwebtoken');;

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
    verify(token,callback){
        jwt.verify(JSON.parse(token),'fakekey',(err,decoded)=>{
            callback(err,decoded);
        });
    }
};