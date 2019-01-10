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

const sendEmail=function (receiver,subject,content) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'cyrillemarvelmedia@gmail.com',
            pass: 'Cyrille@1891'
        }
    });

    var mailOptions = {
        from: 'cyrillemarvelmedia@gmail.com',
        to: receiver,
        subject: subject,
        text: content
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const insertOneDocument = function(collection, documentToInsert, callback) {
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

}
const insertManyDocuments = function(collection,dataToSave,callback) {
    client.connect(function(err) { //server connection
        assert.equal(null, err);
        console.log("connected successfully to server");
        db = client.db(dbName);
        db.collection(collection)
            .insertMany(dataToSave,
                function (err,result)
                {
                    assert.equal(err, null);
                    callback(result);
                });
    });
}
const getDocuments = function(collection,options={}, callback) {
    client.connect(function(err) { //server connection
        assert.equal(null, err);
        console.log("connected successfully to server");
        db=client.db(dbName);
        db.collection(collection).find( options.queries || {}, options.fields||{}).toArray((err,docs)=>{
            callback(err,docs);
        });
    });
}

app.get('/getDocuments/:collection/:options',function (req, res) {
    getDocuments(req.params.collection,req.params.options,(err,docs)=>{
        assert(true,err);
        console.log("list of documents returned");
        res.send(docs);
    });
});

app.post('/insertDocument/:collection',function (req, res) {
    insertOneDocument(req.params.collection,req.body,function (result) {
        console.log("here the result"+JSON.stringify(result));
        let status = JSON.stringify(result);

        if(status==='{"n":1,"ok":1}'){
            console.log(status);
            let subjet=" Account Creation Confirmation ";
            let content = "we are happy to confirm your Account creation";
            sendEmail(req.body.email,subjet,content);
        }
        res.send(JSON.stringify({process:"process ended ",data:result}));
    });
});

app.post('/course', (req, res) => {
    console.log(req.body);
    client.connect(function(err) {
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
    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const collection = db.collection('module');
        // Insert some documents
        insertOneDocument(collection, req.body, (ans)=>res.json(ans));
        // client.close();
    });
    // res.json(result);
});

app.get('/module', (req, res) => {
    console.log(req.body);
    // let result = '';
    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const collection = db.collection('module');
        collection.find({}).toArray((err,result) => {
            console.log('cours',result);
            res.json(result)
        });
        // client.close();
    });
});


app.get('/course', (req, res) => {
    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        const collection = db.collection('courses');
        // Insert some documents
        collection.find({}).toArray((err,result) => {
            console.log('cours',result);
            res.json(result)
        });
        // client.close();
    });
});

app.post('/getPasswordByEmail',(req, res)=>{
    console.log(req.body.email);
    let options={
        queries:{
            'email':req.body.email
        }
    }
    getDocuments('users',options, (err,docs)=>{
        console.log("err: " +err)
        if(docs.length>=1)
        {
            res.send(true);
        }
        else {
            res.send(false);
        }
    });
    /*let newPasswordRecoveryCode = codeGenerator();
    sendEmail(req.body.email,"Password Recovery Code", newPasswordRecoveryCode);*/


});
app.post('/getPasswordByPhoneNumber',(req, res)=>{
    console.log(req.body);
    /*//checking the email address
   getDocuments('users',{'email':req.body.email});
   let newPasswordRecoveryCode = codeGenerator();
   sendEmail(req.body.email,"Password Recovery Code", newPasswordRecoveryCode);
   */

    res.send("Please check your phone");

});
app.post('/getPasswordByCode',(req, res)=>{
    console.log(req.body);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));