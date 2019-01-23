
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const DB_URL = 'mongodb://localhost:27017/';
const dbName = 'alpham';//'courseAppDB';
const client = new MongoClient(DB_URL);


module.exports = {
    insertOneDocument: function (collection, documentToInsert, callback) {
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
    },

    updateOneDocumentById: function (collection, documentToUpdate, callback) {
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
    },

    deleteOneDocumentById: function (collection, documentToDelete, callback) {
        // Insert some documents
        client.connect(function (err) { //server connection
            assert.equal(null, err);
            console.log('connected successfully to server');
            db = client.db(dbName);
            db.collection(collection)
              .deleteOne(ObjectID(documentToDelete._id), function (err, result) {
                  assert.equal(err, null);
                  callback(result);
              });
        });
    },

    getAllDocument: function (collection, callback) {
        // Retrieve all documents
        client.connect(function (err) { //server connection
            assert.equal(null, err);
            console.log('connected successfully to server');
            db = client.db(dbName);

            let arrayElements = db.collection(collection)
                                  .find({}).toArray().then(arrayElements => callback(arrayElements));
        });
    },


    getDocuments: function (collection, options = {}, callback) {
        client.connect(function (err) { //server connection
            assert.equal(null, err);
            console.log('connected successfully to server');
            db = client.db(dbName);
            db.collection(collection).find(options.queries || {}, options.fields || {}).toArray((err, docs) => {
                assert.equal(err, null);
                callback(err, docs);
            });
        });
    },

    findOneDocument: function (collection, options = {}, callback) {
        client.connect(function (err) { //server connection
            assert.equal(null, err);
            console.log('connected successfully to server');
            db = client.db(dbName);
            return db.collection(collection).findOne(options.queries || {}, options.fields || {}, (err, docs) => {
                assert.equal(err, null);
                callback(err, docs);
            });
        });
    },

    updateOne: function (collection, params, callback) {
        client.connect(function (err) { //server connection
            assert.equal(null, err);
            console.log('connected successfully to server');
            db = client.db(dbName);
            db.collection(collection)
              .updateOne(params.filter, params.update, params.options || {}, (err, result) => {
                  callback(err, result);
              });
        });
    },

};