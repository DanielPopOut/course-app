// import { getDocuments, insertOneDocument } from './basicDBFunction';
// import { getDocuments, insertOneDocument } from './basicDBFunction';
let BDFunctions=require('./basicDBFunction');
let MailingFunctions=require('./mail');
const express = require('express');
const app = express();
const port = 7221;
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const cruds = require('./cruds');
const authentication = require('./authentication');
const courses = require('./courses');

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
    // console.info(`${req.method} ${req.originalUrl}`);
    next();
});



/*app.get('/sendMail', (req,res)=>{
    console.log('hmmmm');
   MailingFunctions.sendEmail('daniel.tchangang@gmail.com', 'test', 'test oooohhhhh');
});*/

app.get('/', (req, res) => res.send('Hello World!'));


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

app.get('/findusers',(req,res)=>{
    //console.log("req query "+JSON.stringify(req.query));
    let options={};
    if(req.query.valueToSearch === "")
        options={};
    else
        options= {
            queries:{
                $or:[
                    {name : req.query.valueToSearch},
                    {surname : req.query.valueToSearch},
                    {pseudo : req.query.valueToSearch},
                    {email : req.query.valueToSearch}
                ]
            }

        };
    getDocuments('users',options,(err,docs)=>{
        assert.equal(null, err);
        res.send({success:1,message:"Ce Compte existe deja !",'users':docs});
    });
});

app.post('/*', (req,res,next)=>{
    // console.log(req);
    // console.log('voiciiiiii');
    next()
});
app.use('/authentication', authentication);
app.use('/crudOperations', cruds);
app.use('/courses', courses);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
