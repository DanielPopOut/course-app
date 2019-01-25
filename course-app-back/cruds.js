let express = require('express');
let router = express.Router();


const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const DB_URL = 'mongodb://localhost:27017/';
const dbName = 'alpham';//'courseAppDB';
const client = new MongoClient(DB_URL);
const ObjectID = require('mongodb').ObjectID;


const insertOneDocument = function (collection, documentToInsert, callback) {
    // Insert some documents
    client.connect(function (err) { //server connection
        assert.equal(null, err);
        console.log('connected successfully to server');
        db = client.db(dbName);
        db.collection(collection)
          .insertOne(documentToInsert, function (err, result) {
              assert.equal(err, null);
              callback(result);
          });
    });
};
const updateOneDocumentById = function (collection, documentToUpdate, callback) {
    // Insert some documents
    client.connect(function (err) { //server connection
        assert.equal(null, err);
        console.log('connected successfully to server');
        db = client.db(dbName);
        db.collection(collection)
          .replaceOne({_id: ObjectID(documentToUpdate._id)},
              Object.assign(documentToUpdate, {_id: ObjectID(documentToUpdate._id)}),
              function (err, result) {
                  assert.equal(err, null);
                  console.log('update result', result);
                  callback(result);
              });
    });
};
const deleteOneDocumentById = function (collection, documentToDelete, callback) {
    // Insert some documents
    client.connect(function (err) { //server connection
        assert.equal(null, err);
        console.log('connected successfully to server');
        db = client.db(dbName);
        db.collection(collection)
          .deleteOne({_id: ObjectID(documentToDelete._id)}, function (err, result) {
              assert.equal(err, null);
              callback(result);
          });
    });
};
const getAllDocument = function (collection, callback) {
    // Retrieve all documents
    client.connect(function (err) { //server connection
        assert.equal(null, err);
        console.log('connected successfully to server');
        db = client.db(dbName);

        let arrayElements = db.collection(collection)
                              .find({}).toArray().then(arrayElements => callback(arrayElements));
    });
};
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
// define the home page route
router.get('/', function (req, res, next) {
    console.log('router works');
    next();
});

router.get('/loup', function (req, res) {
    console.log('ekie');
});
// define the about route
router.get('/about', function (req, res) {
    res.send('About birds');
});

router.post('/get', function (req, res) {
    let {collection, data} = {...req.body};
    console.log(collection, data);
    getAllDocument(collection, result => {
        console.log('***********************');
        console.log('***********************');
        console.log('***********************');
        console.log('***********************');
        console.log('***********************');
        console.log('result', result.length, ' element returned ');
        res.send(JSON.stringify(result));
    });
    // insertOneDocument(collection,data)
});

router.post('/insert', function (req, res) {
    let {collection, data} = {...req.body};
    console.log(collection, data);
    insertOneDocument(collection, data, (result) => res.send(result.insertedId));
});

router.post('/delete', function (req, res) {
    let {collection, data} = {...req.body};
    console.log(collection, data);
    deleteOneDocumentById(collection, data, (result) => res.send(result.insertedId));
});

router.post('/update', function (req, res) {
    let {collection, data} = {...req.body};
    console.log(collection, data);
    updateOneDocumentById(collection, data, (result) => res.send(result.insertedId));

});

module.exports = router;