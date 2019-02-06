const express = require('express');
const app = express();
const port = 7221;
const cors = require('cors');
const bodyParser = require('body-parser');

const cruds = require('./cruds');
const authentication = require('./authentication');
const courses = require('./courses');

let CrudDBFunctions=require('./CrudDBFunctions');


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

app.get('/', (req, res) => res.send('Hello World!'));

/*app.get('/getDocuments/:collection/:options', function (req, res) {
    getDocuments(req.params.collection, req.params.options, (err, docs) => {
        assert(true, err);
        console.log("list of documents returned");
        res.send(docs);
    });
});*/

/*app.post('/insertDocument/:collection', function (req, res) {
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
});*/

/*app.post('/course', (req, res) => {
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
});*/

/*app.post('/module', (req, res) => {
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
});*/

/*app.get('/module', (req, res) => {
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
});*/

/*app.get('/course', (req, res) => {
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
});*/

/*app.get('/findusers',(req,res)=>{
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
    DBFunctions.getDocuments('users',options,(err,docs)=>{
        assert.equal(null, err);
        res.send({success:1,message:"Ce Compte existe deja !",'users':docs});
    });
});*/
app.post('/finduserswithemails',(req,res)=>{
    //console.log("req query "+JSON.stringify(req.query));
    let options= {
            queries:{
                email:{$in:req.body}
            }
        };
   CrudDBFunctions.getAllDocument({
       collection: 'users',
       options: options,
       callback: (result,err='')=>{
           if(err){
               console.log('error',err);
               res.status(500).send({errorMessage:"User List Could not be returned !!"});
           }else{
               res.status(200).send(result);
           }
       }
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
