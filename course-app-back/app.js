const express = require('express');
const app = express();
const port = 7221;
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
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


app.get('/listElements/:collection',function (req, res) {

    getDocuments(req.params.collection,{},(err,docs)=>{
        assert(true,err);
        console.log("list of documents");
        res.send(docs);
    });
});

app.post('/insertDocument/:collection',function (req, res) {
    insertOneDocument(req.params.collection,req.body,function (result) {
        console.log("here the result"+JSON.stringify(result.status));
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));