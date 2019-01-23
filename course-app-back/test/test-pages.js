//Link to learn testing : https://buddy.works/guides/how-automate-nodejs-unit-tests-with-mocha-chai
//Using async/await ==> https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35

let expect = require('chai').expect;
let request = require('request');

it('Main page content', function (done) {
    request('http://localhost:7221/', function (error, response, body) {
        console.log('amigo', body);
        expect(body).to.equal('Hello World!');
        done();
    });
});


const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const DB_URL = 'mongodb://localhost:27017/';
const dbName = 'alpham';//'courseAppDB';
const client = new MongoClient(DB_URL);
const ObjectID = require('mongodb').ObjectID;

const collectionTest = 'test1';
let db = '';

describe('Database Tests', function () {
    let documentToInsert = {name: 'test', value: 'test'};
    //Before starting the test, create a sandboxed database connection
    //Once a connection is established invoke done()
    before(function (done) {
        client.connect(function (err) { //server connection
            assert.equal(null, err);
            db = client.db(dbName);
            console.log('connected successfully to server');
            done();
        });
    });
    describe('Test Database', function () {
        //Save object documentToInsert
        it('New test element saved to test database', async () => {
            let result =  await db.collection(collectionTest)
              .insertOne(documentToInsert).then( (result)=> {
                  documentToInsert._id = result.insertedId;
                  return result.insertedId
              });
            expect(result.insertedId).not.to.equal(null);
            // console.log('REAL RESULT ', result);

        });
        //Retrieve all objects
        it('Retrieve all object', async ()=> {
            let resultArray = await db.collection(collectionTest)
              .find({}).toArray()
            // console.log(resultArray);
            expect(resultArray.length).to.equal(1);

        });



        //Delete Object inserted
        it('Delete Object inserted', async ()=> {
            // console.log('document to delete', documentToInsert);
            const resultDeletion =  await db.collection(collectionTest)
              .deleteOne({_id: ObjectID(documentToInsert._id)})
            expect(resultDeletion.deletedCount).to.equal(1);
        });
    });



    //After all tests are finished drop database and close connection
    // after(function(done){
    //     mongoose.connection.db.dropDatabase(function(){
    //         mongoose.connection.close(done);
    //     });
    // });
});