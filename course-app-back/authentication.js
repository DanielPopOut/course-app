// import { findOneDocument, getDocuments, insertOneDocument, updateOne } from './basicDBFunction';

let BDFunctions = require('./basicDBFunction');
let MailingFunctions = require('./mail');


let express = require('express');
let router = express.Router();


const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const DB_URL = 'mongodb://localhost:27017/';
const dbName = 'alpham';//'courseAppDB';
const client = new MongoClient(DB_URL);
const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');

const USER_DB_NAME = 'users';


const generateToken = function (user) {

    let payload = {
        name: user.pseudo,
        admin: user.admin,
    };
    let secret = 'fakekey';
    let options = {
        expiresIn: 60 * 60,
        //algorithm:'RS256'
    };
    let token = jwt.sign(payload, secret, options);
    return token;
};

router.get('/validate/:id', (req, res) => {
    BDFunctions.findOneDocument(USER_DB_NAME,
        {queries: {_id: ObjectID(req.params.id)}},
        (err, doc) => {
        if (doc){
            BDFunctions.updateOne(USER_DB_NAME,
                {filter: {_id: ObjectID(req.params.id)}, update: {$set: { validated : true }}},
                (err, result)=> {
                console.log(result);
                    res.json("merci d'avoir validé votre compté :-)!")
                })
        }else {
            console.log(doc)
            res.json("Compte introuvable!")
        }
    });
});

router.post('/newuser', (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({text: 'data required not filled'});
    }
    let options = {
        queries: {
            $or: [
                {email: req.body.email.toLowerCase()},
                {pseudo: req.body.pseudo},
            ],
        },
    };

    let userExist = false;
    BDFunctions.getDocuments(USER_DB_NAME, options, (err, docs) => {
        if (docs.length === 0) {
            BDFunctions.insertOneDocument('users', req.body, (result) => {
                let success = JSON.stringify(result);
                if (success === '{"n":1,"ok":1}') {
                    MailingFunctions.sendEmail(req.body.email, 'Bienvenue chez AlphaM', 'Cliquez sur ce lien pour confirmer votre compte :  http://localhost:7221/authentication/validate/' + result.insertedId);
                    res.send({success: 1, message: 'Compte enregistre. veuillez confirmer via votre adresse mail'});
                } else {
                    res.send({success: 1, message: 'Desole. votre compte n\'a pas ete enregistre'});
                }
            });
        } else {
            res.send({success: 0, message: 'Ce Compte existe deja !'});
        }
    });
});


router.post('/passwordRecovery', (req, res) => {
    console.log('req.body', req.body);
    let response = {};
    let options = {
        queries: {
            [req.body.contactoremail]: req.body[req.body.contactoremail],
        },
    };

    BDFunctions.getDocuments('users', options, (err, docs) => {
        console.log('err: ' + err);
        let codeGenerator = () => {
            let code = new String();
            for (let i = 1; i <= 4; i++) {
                code = code + Math.floor(Math.random() * 10).toString();
            }
            return code;
        };
        if (docs.length >= 1) {
            console.log(docs);
            let code = codeGenerator();
            console.log('code : ' + code);
            let updateParams = {
                filter: {
                    [req.body.contactoremail]: req.body[req.body.contactoremail],
                },
                update: {
                    $set: {passwordresetcode: code},
                },
                options: {
                    upsert: false,
                },
            };

            // sendEmail("cyrilledassie@gmail.com","password-recovery",code);

            BDFunctions.updateOne('users', updateParams, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    console.log(err);
                }
            });
            response = {success: 1, message: 'un code vous a ete envoye !'};
            MailingFunctions.sendEmail(req.body[req.body.contactoremail],
                'Reinitialisation de votre mot de passe AlphaM',
                'Le code pour réinitialiser votre mot de passe est ' + code);
        }
        else {
            response = {success: 0, message: 'Compte Introuvable!. Verifiez vos parametres SVP.'};
        }
        res.send(response);
    });
});

router.post('/passwordRecoveryCode', (req, res) => {
    console.log(req.body);
    let options = {
        queries: {
            [req.body.contactoremail]: req.body[req.body.contactoremail],
            passwordresetcode: req.body.code,
        },
    };
    BDFunctions.findOneDocument('users', options, (err, doc) => {
        console.log('document');
        console.log(JSON.stringify(doc));
        if (doc === null) {
            res.send({success: 0, message: 'Code incorrect. Vérifiez et reéssayez SVP!.'});
        } else {
            res.send({success: 1, message: 'Code vérifié'});
        }
    });
});

router.post('/passwordReset', (req, res) => {
    console.log(req.body);

    let updateParams = {
        filter: {
            [req.body.contactoremail]: req.body[req.body.contactoremail],
            passwordresetcode: req.body.code,
        },
        update: {
            $set: {
                password: req.body.newpassword,
            },
        },
        options: {
            upsert: false,
        },
    };
    BDFunctions.updateOne('users', updateParams, (err, result) => {
        let response = {};
        if (err) {
            response = {success: 0, message: 'Mise a jour non effectuee'};
            throw err;
        } else {
            response = {success: 1, message: 'Mise a jour effectuee avec succes !'};
            console.log(err);
        }
        res.send(response);
    });
});


router.post('/login', function (req, res) {
    let options = {
        queries: {
            pseudo: req.body.pseudo,
            password: req.body.password,
        },
    };
    BDFunctions.findOneDocument('users', options, (err, doc) => {
        if (doc === null) {
            res.send({success: 0, message: 'Login incorrect. Vérifiez et reéssayez SVP!.'});
        } else {
            console.log(doc);
            let token = generateToken({pseudo: doc.pseudo, admin: false});
            console.log('token : ' + token);
            console.log('verify ' + jwt.verify(token, 'fakekey'));
            res.send(token);
        }
    });
});


module.exports = router;