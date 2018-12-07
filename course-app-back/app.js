const express = require('express');
const app = express();
const port = 7221;
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

const DB_URL = 'mongodb://localhost:27017/';
const dbName = 'courseAppDB';
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

let areaToShow2 = ['maths', 'physics', 'chemistry', 'banana', 'bandito'];

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/baoebga', (req, res) => res.send('Hello World! /baoebga'));
app.get('/testundefined', (req, res) => res.json('Voici un test mon ami ! '));
app.post('/testundefined', (req, res) => res.json(areaToShow2));

const insertOneDocument = function(collection, documentToInsert, callback= x=> console.log(x)) {

    // Insert some documents
    collection.insertOne(documentToInsert, function(err, result) {
        // assert.equal(err, null)
        // assert.equal(3, result.result.n);
        // assert.equal(3, result.ops.length);
        // console.log("Inserted 3 documents into the collection");
        console.log(result);
        callback(result);
    });
}


app.post('/course', (req, res) => {
    console.log(req.body);
    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        const collection = db.collection('courses');
        // Insert some documents
        insertOneDocument(collection, req.body);
        client.close();
    });
    res.json(areaToShow2);
});



app.get('/course', (req, res) => {
    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        const collection = db.collection('courses');
        // Insert some documents
        collection.find({}).toArray((err,result) => {
            console.log(result);
            res.json(result)
        });
        client.close();
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));