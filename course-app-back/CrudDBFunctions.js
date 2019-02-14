const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const DB_URL = 'mongodb://localhost:27017/';
const dbName = 'alpham';//'courseAppDB';
const client = new MongoClient(DB_URL);

const ObjectID = require('mongodb').ObjectID;

module.exports = {
    insertOneDocument: function (collection, documentToInsert, callback) {
        // Insert some documents
        client.connect(async function (err) {//server connection
            assert.equal(null, err);
            console.log('connected successfully to server');
            let database=client.db(dbName);
            try {
                let result = await database.collection(collection)
                    .insertOne(documentToInsert);
                callback(result);
            }catch (e) {
                callback({},e);
            }
        });
    },

    replaceOneDocumentById: function (collection, documentToUpdate, callback) {
        client.connect(async function (err) { //server connection
            assert.equal(null, err);
            console.log('connected successfully to server');
            let database=client.db(dbName);
            try {
                // console.log('doc to update ',Object.assign({},documentToUpdate, {_id: ObjectID(documentToUpdate._id)}));
                let result = await database.collection(collection).replaceOne(
                        {_id: ObjectID(documentToUpdate._id)},
                    Object.assign(documentToUpdate,{_id:ObjectID(documentToUpdate._id)})
                    );
                console.log("result",result);
                callback(result.ops[0]);
            }catch (e) {
                callback({},e);
            }
        });
    },

    updateOneDocumentById: function (collection, documentToUpdate, updateToMake, callback) {
        // Insert some documents
        client.connect(async function (err) { //server connection
            assert.equal(null, err);
           /* console.log('update To make', updateToMake, {_id: ObjectID(documentToUpdate._id)});
            console.log("replacement object ", Object.assign(documentToUpdate,{_id:ObjectID(documentToUpdate._id)},updateToMake));
*/            let database=client.db(dbName);
            try {
                let result = await database.collection(collection)
                    .replaceOne(
                        {_id: ObjectID(documentToUpdate._id)},
                        Object.assign(documentToUpdate,{_id:ObjectID(documentToUpdate._id)},updateToMake)
                    );
                //console.log("replacement result ",result);
                callback(result);
            }catch (e) {
                callback({},e);
            }
        });
    },

    deleteOneDocumentById: function (collection, documentToDelete, callback) {
        // Insert some documents
        client.connect(async function (err) { //server connectiogit pulln
            assert.equal(null, err);
            console.log('connected successfully to server');
            let database=client.db(dbName);
            try {
                let result = await database.collection(collection)
                    .deleteOne({_id: ObjectID(documentToDelete._id)});
                console.log('deletion happened', result);
                callback(result);
            }catch (e) {
                callback({},e);
            }
        });
    },

    getAllDocument: function ({collection, options = {}, callback}) {
        // Retrieve all documents
        client.connect(async function (err) { //server connection
            assert.equal(null, err);
            console.log('connected successfully to server');
            let database=client.db(dbName);
            try {
                let arrayElements = await database.collection(collection)
                    .find(options.queries || {}, options.fields || {}).toArray();
                callback(arrayElements);
            } catch (e) {
                callback({},e);
            }
        });
    },

    getOneDocument: function ({collection, options = {}, callback}) {
        client.connect( async function (err) { //server connection
            assert.equal(null, err);
            console.log('connected successfully to server');
            let database=client.db(dbName);
            try {
                let result = await database
                    .collection(collection)
                    .findOne(options.queries || {}, options.fields || {});
                callback(result)
            }catch (e) {
                callback({},e);
            }
        });
    },
};
