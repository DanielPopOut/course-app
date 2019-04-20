const jwt = require('jsonwebtoken');

let express = require('express');
let router = express.Router();
let CrudDBFunctions = require('./CrudDBFunctions');
let TokenFunctions = require('./token');
const ObjectID = require('mongodb').ObjectID;
let MailingFunctions = require('./mail');


/**
 * reply to a user
 */
router.post('/reply', (req, res) => {
    let {message,reply} = {...req.body};

    let subject = "Online Course Reply !! !noReply";
    MailingFunctions.sendEmail(message.email,subject,reply,(error,info)=>{
        if(error){
            console.log("Email  not Sended ",error);
            res.status(403).json({errorMessage:"Sorry, couldn't send the message"});
        }else {
            console.log("Email Sended ",info);
            let replies=message.replies||[];
            replies.push(reply);
            console.log("message ",message,"reply ",reply);
            CrudDBFunctions.updateOneDocumentById(
                "messages",
                message,
                {replies: replies},
                (result, err = "") => {
                    if (err) {
                        console.log("update error", err);
                        res.status(403).json({errorMessage: "email Sended !!"})
                    } else {
                        res.status(200).json({message: "message sended with success !!"});
                    }
                }
            );
        }
    });

});

module.exports = router;