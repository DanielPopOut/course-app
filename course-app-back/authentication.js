let CrudDBFunctions = require('./CrudDBFunctions');
let MailingFunctions = require('./mail');
let TokenFunctions=require('./token');
let express = require('express');
let router = express.Router();

const jwt = require('jsonwebtoken');

const collectionName = 'users';
const ObjectID = require('mongodb').ObjectID;


router.get('/validate/:id', (req, res) => {
    CrudDBFunctions.getOneDocument({
        collection:'users',
        options:{
            queries:{_id:ObjectID(req.params.id)}
        },
        callback:(result,err='')=>{
            if(err){
                res.status(403).send("users not found !!")
            }else {
                console.log("users to validate : ",result);
                CrudDBFunctions.updateOneDocumentById(
                    'users',
                    result,
                    {"validated":true},
                    (result,err='')=>{
                        if(err){
                            console.log('err',err);
                            res.status(400).send("User Found but validation Failed !!");
                        }else {
                            res.status(200).send("Email validated Successfully "+result);
                        }
                    }
                )
            }
        }
    });
});

router.post('/newuser', (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.pseudo) {
        res.status(403).json({errorMessage: 'data required not filled'});
    }else{
        let options = {
            queries: {
                $or: [
                    {email: req.body.email.toLowerCase()},
                    {pseudo: req.body.pseudo},
                ],
            },
        };
        let userExist = false;

        CrudDBFunctions.getOneDocument({
            collection:'users',
            options:options,
            callback:(result,err='')=>{
                if(err){
                    console.log('error',err);
                    res.status(403).json({errorMessage:"Could Not Create New User "});
                }else {
                    if(!result){
                        CrudDBFunctions.insertOneDocument(
                            'users',
                            req.body,
                            (result,err='')=>{
                                if(err){
                                    console.log('error',err);
                                    res.status(400).send('insertion failed');
                                }else {
                                    MailingFunctions.sendEmail(req.body.email, 'Bienvenue chez AlphaM', 'Cliquez sur ce lien pour confirmer votre compte :  http://localhost:7221/authentication/validate/' + result.insertedId);
                                    res.status(200).json({message: 'Compte enregistre. veuillez confirmer via votre adresse mail'});
                                }
                            });
                    }else {
                        let message="";
                        if(result.email === req.body.email){
                            message=" Cet adresse est deja utilisé.";
                        }
                        if(result.pseudo === req.body.pseudo){
                            message=message+" Ce Pseudo est deja utilisé.";
                        }
                        res.status(403).json({errorMessage: message});
                    }
                }
            }
        });
    }
});

router.post('/passwordRecovery', (req, res) => {
    console.log('req.body', req.body);
    let response = {};
    let options = {
        queries: {
            [req.body.contactoremail]: req.body[req.body.contactoremail],
        },
    };
    CrudDBFunctions.getOneDocument({
        collection:'users',
        options:options,
        callback: (result,err='') => {
            if(err) {
                console.log('error',err);
                res.status(403).json({errorMessage:"Desole Cet Email n\'est pas valide !!"});
            }else {
                console.log(result.length, ' elements returned ');
                //res.status(200).json(JSON.stringify(result));
                let codeGenerator = () => {
                    let code = new String();
                    for (let i = 1; i <= 4; i++) {
                        code = code + Math.floor(Math.random() * 10).toString();
                    }
                    return code;
                };
                let code = codeGenerator();
                console.log('code : ' + code);

                CrudDBFunctions.updateOneDocumentById(
                    'users',
                    result,
                    {"passwordresetcode": code},
                    (result, err = '') => {
                        if (err) {
                            console.log('error', err);
                            res.status(403).send({errorMessage: "Update failed !!"});
                        } else {
                            MailingFunctions.sendEmail(
                                req.body[req.body.contactoremail],
                                'Reinitialisation de votre mot de passe AlphaM',
                                'Le code pour réinitialiser votre mot de passe est ' + code
                            );
                            res.status(200).send({message: "un code vous a ete envoye !'"})
                        }
                    });
            }
        }
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
    CrudDBFunctions.getOneDocument({
        collection:'users',
        options,
        callback:(result,err)=>{
            if (err){
                console.log("error ",err);
                res.status(404),send({errorMessage:"User Not Found !!"});
            } else {
                res.status(200).send({message:"Code Vérifié"});
            }
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
    let options = {
        queries: {
            [req.body.contactoremail]: req.body[req.body.contactoremail],
            passwordresetcode: req.body.code,
        },
    };
    CrudDBFunctions.getOneDocument({
        collection:'users',
        options:options,
        callback:(result,err='')=>{
            if(err){
                console.log('error',err);
                res.status(403).json({errorMessage:"corresponding user not Found"});
            }else {
                CrudDBFunctions.updateOneDocumentById(
                    'users',
                    result,
                    {
                        password: req.body.newpassword
                    },
                    (result,err='')=>{
                        if(err){
                            console.log('err',err);
                            res.status(403).json({ errorMessage : "Password Reset failed !!" });
                        }else {
                            res.status(200).json({ message : " Password Reset Successfully" });
                        }
                    });
            }
        }
    });

});

router.post('/login', function (req, res) {

    let options = {
        queries: {
            pseudo: req.body.pseudo,
            password: req.body.password,
        },
    };

    CrudDBFunctions.getOneDocument({
        collection:'users',
        options:options,
        callback:(result,err='')=>{
            if(err){
                console.log('Login error ',err);
                res.status(403).json({errorMessage:"Incorrect Login or Password !!"});
            }else {
                console.log(result);
                if(result){
                    let token = TokenFunctions.generateToken(result);
                    res.status(200).json({token: token});
                }else {
                    res.status(403).json({errorMessage:"Incorrect Login or Password !!"});
                }
            }
        }
    });
});


module.exports = router;