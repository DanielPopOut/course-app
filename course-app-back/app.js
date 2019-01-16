const express = require('express');
const app = express();
const port = 7221;
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

const DB_URL = 'mongodb://localhost:27017/';
const dbName = 'alpham';//'courseAppDB';
const assert = require('assert');
const client = new MongoClient(DB_URL);


var nodemailer = require('nodemailer');


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

app.get('/', (req, res) => res.send('Hello World!'));

const sendEmail = function (receiver, subject, content) {
    var transporter = nodemailer.createTransport({
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
        let status = JSON.stringify(result);

        if (status === '{"n":1,"ok":1}') {
            console.log(status);
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
    function checkExist() {
        let options={
            queries:{
                $or:[
                    {email:req.body.email},
                    {pseudo : req.body.pseudo}
                ]
            }
        };
        getDocuments('users',options,(err,docs)=>{
            if(docs.length===0){
                return true;
            }
        });
        return false;
    }

    if (checkExist()){
        insertOneDocument('users',req.body,(result)=>{
            let status = JSON.stringify(result);
            if (status === '{"n":1,"ok":1}') {
                res.send({status:1,message:"Compte enregistre. veuillez confirmer via votre adresse mail"});
            }else{
                res.send({status:1,message:"Desole. votre compte n\'a pas ete enregistre"});
            }
        });
    }else {
        res.send({status:0,message:"Ce Compte existe deja !"});
    }
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
            response={status:1,message:"un code vous a ete envoye !"};
        }
        else {
            response={status:0,message:"Compte Introuvable!. Verifiez vos parametres SVP."};
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
            res.send({status:0,message:"Code incorrect. Vérifiez et reéssayez SVP!."})
        }else {
            res.send({status:1,message:"Code vérifié"})
        }
    });
});

app.post('/getPasswordByCode', (req, res) => {
    console.log(req.body);
    res.send("code");
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));