let express = require('express');
let router = express.Router();
const ObjectID = require('mongodb').ObjectID;
let CrudDBFunctions = require('./CrudDBFunctions');


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

router.post('/get', function (req, res) {
    let {collection, options} = {...req.body};
    //console.log(collection, data);
    if((options['queries']) &&  options['queries']['_id']){
        options['queries']['_id']=ObjectID(options['queries']['_id']);
    }
    console.log("options ",options);
    CrudDBFunctions.getAllDocument({
        collection:collection,
        options:options||{},
        callback: (result,err='') => {
            if (err) {
                console.log('error', err);
                res.status(400).send({message: "error"});
            } else {
                console.log(collection, result.length, ' elements returned ');
                //res.status(200).json(JSON.stringify(result));
                res.status(200).json(result);
            }
        }
    });
});

router.post('/insert', function (req, res) {
    let {collection, data} = {...req.body};
    console.log(collection, data);
    CrudDBFunctions.insertOneDocument(collection, data,
        (result,err='') => {
        if(err) {

            console.log('error',err);
            res.status(400).send({message:"Insertion failed !!"});
        }else {
            console.log(collection, result.length, ' elements returned ');
            //res.status(200).json(JSON.stringify(result));
            res.status(200).send(result.insertedId);
        }
        //(result) => res.send(result.insertedId));
});});

router.post('/delete', function (req, res) {
    let {collection, data} = {...req.body};
    console.log(collection, data);
    CrudDBFunctions.deleteOneDocumentById(
        collection,
        data,
       // (result) => res.send(result),
        (result,err='') => {
            if(err) {
                console.log('error',err);
                res.status(400).send({message:"Deletion failed!!"});
            }else {
                console.log(collection, result.length, ' elements returned ');
                //res.status(200).json(JSON.stringify(result));
                res.status(200).send(result);
            }
        }
    );
});

router.post('/replace', function (req, res) {
    let {collection, data} = {...req.body};
    console.log(collection, data);
    CrudDBFunctions.replaceOneDocumentById(
        collection,
        data,
        (result,err='') => {
            if(err) {
                console.log('error',err);
                res.status(400).send({message:"replace failed!!"});
            }else {
               // console.log(collection, result, ' elements returned ');
                //res.status(200).json(JSON.stringify(result));
                res.status(200).send(result);
            }
        });
        //(result) => res.send(result.insertedId));

});

router.post('/update', function (req, res) {
    let {collection, data, update} = {...req.body};
    console.log(collection, data, update);
    CrudDBFunctions.updateOneDocumentById(
        collection,
        data,
        update,
        (result,err='') => {
            if(err) {
                console.log('update error',err);
                res.status(400).send({errorMessage:"update failed!!"});
            }else {
                if(result.result.nModified===0){
                    console.log("collection : ",collection,"; data :",data,"; update : ",update);
                    console.log("update result", result.result);
                    res.status(403).send({errorMessage:"update failed!! no modification"});
                    console.log("failed");
                }else {
                    console.log("successful");
                    console.log("update result", result.result);
                    //res.status(200).json(JSON.stringify(result));
                    res.status(200).send(result);
                }
            }
        }
    );
        //(result) => res.send(result));
});

module.exports = router;