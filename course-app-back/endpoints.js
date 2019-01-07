let express = require('express');
let router = express.Router();


const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const DB_URL = 'mongodb://localhost:27017/';
const dbName = 'alpham';//'courseAppDB';
const client = new MongoClient(DB_URL);


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
    console.log(collection, action, data);
    // insertOneDocument(collection,data)
});

router.post('/insert', function (req, res) {
    let {collection, data} = {...req.body};
    console.log(collection, action, data);
    insertOneDocument(collection,data)
});

router.post('/delete', function (req, res) {
    let {collection, data} = {...req.body};
    console.log(collection, action, data);

});

router.post('/update', function (req, res) {
    let {collection, data} = {...req.body};
    console.log(collection, action, data);

});

module.exports = router;