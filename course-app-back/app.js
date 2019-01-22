const express = require('express');
const app = express();
const port = 7221;
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
const endpoints = require('./endpoints');


const DB_URL = 'mongodb://localhost:27017/';
const dbName = 'alpham';//'courseAppDB';
const assert = require('assert');
const client = new MongoClient(DB_URL);



app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

app.use(function (req, res, next) {
    console.info(`${req.method} ${req.originalUrl}`);
    next();
});

app.use('/api', endpoints);

app.get('/', (req, res) => res.send('Hello World!'));

const generateToken = function (user) {

    let payload={
        name:user.pseudo,
        admin:user.admin
    };
    let secret="fakekey";
    let options={
        expiresIn: 60 * 60
        //algorithm:'RS256'
    };
    let token = jwt.sign(payload,secret,options);
    return token;
};

const sendEmail = function (receiver, subject, content) {
    let nodemailer = require('nodemailer');
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        service: 'Gmail',
        auth: {
            user: 'cyrillemarvelmedia@gmail.com',
            pass: 'Cyrille@1891',
            type: 'OAuth2',
        }
    });

    var mailOptions = {
        from: 'cyrillemarvelmedia@gmail.com',
        to: receiver,
        subject: subject,
        text: content
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

const insertOneDocument = function (collection, documentToInsert, callback) {
    // Insert some documents
    client.connect(function (err) { //server connection
        assert.equal(null, err);
        console.log("connected successfully to server");
        db = client.db(dbName);
        db.collection(collection)
            .insertOne(documentToInsert, function (err, result) {
                assert.equal(err, null);
                callback(result);
            });
    });
};
const insertManyDocuments = function (collection, dataToSave, callback) {
    client.connect(function (err) { //server connection
        assert.equal(null, err);
        console.log("connected successfully to server");
        db = client.db(dbName);
        db.collection(collection)
            .insertMany(dataToSave,
                function (err, result) {
                    assert.equal(err, null);
                    callback(result);
                });
    });
};
const getDocuments = function (collection, options = {}, callback) {
    client.connect(function (err) { //server connection
        assert.equal(null, err);
        console.log("connected successfully to server");
        db = client.db(dbName);
        db.collection(collection).find(options.queries || {}, options.fields || {}).toArray((err, docs) => {
            assert.equal(err, null);
            callback(err, docs);
        });
    });
};
const findOneDocument = function (collection, options = {}, callback) {
    client.connect(function (err) { //server connection
        assert.equal(null, err);
        console.log("connected successfully to server");
        db = client.db(dbName);
        db.collection(collection).findOne(options.queries || {}, options.fields || {},(err, docs) => {
            assert.equal(err, null);
            callback(err, docs);
        });
    });
};

const updateOne=function(collection,params,callback){
    client.connect(function (err) { //server connection
        assert.equal(null, err);
        console.log("connected successfully to server");
        db = client.db(dbName);
        db.collection(collection)
            .updateOne(params.filter,params.update,params.options||{},(err,result)=>{
                callback(err,result);
            });
    });
};

app.get('/getDocuments/:collection/:options', function (req, res) {
    getDocuments(req.params.collection, req.params.options, (err, docs) => {
        assert(true, err);
        console.log("list of documents returned");
        res.send(docs);
    });
});

app.post('/insertDocument/:collection', function (req, res) {
    insertOneDocument(req.params.collection, req.body, function (result) {
        console.log("here the result" + JSON.stringify(result));
        let success = JSON.stringify(result);

        if (status === '{"n":1,"ok":1}') {
            console.log(success);
            let subjet = " Account Creation Confirmation ";
            let content = "we are happy to confirm your Account creation";
            sendEmail(req.body.email, subjet, content);
        }
        res.send(JSON.stringify({process: "process ended ", data: result}));
    });
});

app.post('/course', (req, res) => {
    console.log(req.body);
    client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const collection = db.collection('courses');
        // Insert some documents
        insertOneDocument(collection, req.body);
        // client.close();
    });
    res.json(areaToShow2);
});

app.post('/module', (req, res) => {
    console.log(req.body);
    // let result = '';
    client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const collection = db.collection('module');
        // Insert some documents
        insertOneDocument(collection, req.body, (ans) => res.json(ans));
        // client.close();
    });
    // res.json(result);
});

app.get('/module', (req, res) => {
    console.log(req.body);
    // let result = '';
    client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const collection = db.collection('module');
        collection.find({}).toArray((err, result) => {
            console.log('cours', result);
            res.json(result)
        });
        // client.close();
    });
});


app.get('/course', (req, res) => {
    client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const collection = db.collection('courses');
        // Insert some documents
        collection.find({}).toArray((err, result) => {
            console.log('cours', result);
            res.json(result)
        });
        // client.close();
    });
});

app.post('/newuser',(req,res)=>{

        let options={
            queries:{
                $or:[
                    {email:req.body.email.toLowerCase()},
                    {pseudo : req.body.pseudo}
                ]
            }
        };

        let userExist=false;
        getDocuments('users',options,(err,docs)=>{
            if(docs.length===0){
                insertOneDocument('users',req.body,(result)=>{
                    let success = JSON.stringify(result);
                    if (success === '{"n":1,"ok":1}') {
                        res.send({success:1,message:"Compte enregistre. veuillez confirmer via votre adresse mail"});
                    }else{
                        res.send({success:1,message:"Desole. votre compte n\'a pas ete enregistre"});
                    }
                });
            }else {
                res.send({success:0,message:"Ce Compte existe deja !"});
            }
        });
});
app.post('/passwordRecovery', (req, res) => {

    var response={};
    let options = {
        queries: {
            [req.body.phoneoremail]: req.body[req.body.phoneoremail]
        }
    };
    function codeGenerator(){
        let code = "";
        for(let i=1;i<=4;i++){
            code.concat(""+Math.floor(Math.random() * 10));
        }
        return code;
    }
    getDocuments('users', options, (err, docs) => {
        console.log("err: " + err)
        let codeGenerator=()=>{
            let code = new String();
            for(let i=1;i<=4;i++){
              code=code+Math.floor(Math.random() * 10).toString();
            }
            return code;
        };
        if (docs.length >= 1) {
            console.log(docs);
            let code = codeGenerator();
            console.log("code : "+code);
            let updateParams={
                filter:{
                    [req.body.phoneoremail]: req.body[req.body.phoneoremail]
                },
                update:{
                    $set:{passwordresetcode: code}
                },
                options:{
                    upsert:false
                }
            };

           // sendEmail("cyrilledassie@gmail.com","password-recovery",code);

            updateOne("users",updateParams,(err,result)=>{
                if(err) {
                    throw err;
                } else{
                    console.log(err);
                }
            });
            response={success:1,message:"un code vous a ete envoye !"};
        }
        else {
            response={success:0,message:"Compte Introuvable!. Verifiez vos parametres SVP."};
        }
        res.send(response);
    });
});

app.post('/passwordRecoveryCode', (req,res)=>{
    console.log(req.body);
    let options = {
        queries: {
            [req.body.phoneoremail]: req.body[req.body.phoneoremail],
            passwordresetcode:req.body.code
        }
    };
    findOneDocument('users',options, (err,doc)=>{
        console.log("document");
        console.log(JSON.stringify(doc));
        if(doc === null){
            res.send({success:0,message:"Code incorrect. Vérifiez et reéssayez SVP!."})
        }else {
            res.send({success:1,message:"Code vérifié"})
        }
    });
});

app.post('/passwordReset', (req, res) => {
    console.log(req.body);

    let updateParams={
        filter:{
            [req.body.contactoremail]: req.body[req.body.contactoremail],
            passwordresetcode:req.body.code
        },
        update:{
            $set:{
                password:req.body.newpassword
            }
        },
        options:{
            upsert:false
        }
    };
    updateOne('users',updateParams,(err,result)=>{
        let response={};
        if(err) {
            response ={success:0,message:"Mise a jour non effectuee"};
            throw err;
        } else{
            response ={success:1,message:"Mise a jour effectuee avec succes !"};
            console.log(err);
        }
        res.send(response);
    });
});

app.post('/authentication', function (req, res) {
    let options = {
        queries: {
            pseudo: req.body.pseudo,
            password:req.body.password
        }
    };
    findOneDocument('users',options, (err,doc)=>{
        if(doc === null){
            res.send({success:0,message:"Login incorrect. Vérifiez et reéssayez SVP!."});
        }else {
            console.log(doc);
            let token=generateToken({pseudo:doc.pseudo, admin:false});
            console.log('token : '+token);
            console.log("verify "+jwt.verify(token,"fakekey"));
            res.send({success:1,message:"Code vérifié",token:token,verify:jwt.verify(token,"fakekey")});
        }
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));