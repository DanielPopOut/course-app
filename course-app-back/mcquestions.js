const jwt = require('jsonwebtoken');

let express = require('express');
let router = express.Router();
let CrudDBFunctions = require('./CrudDBFunctions');
let TokenFunctions = require('./token');
const ObjectID = require('mongodb').ObjectID;

router.get('/getAll', (req, res) => {
    CrudDBFunctions.getAllDocument({
        collection: 'mcqs',
        callback: (result, err = "") => {
            if (err) {
                res.status(400).json({errorMessage: err.toString()});
            } else {
                res.status(200).send(result);
            }
        }
    });
});

router.post('/new', (req, res) => {
    try {
        console.log("mcq body ", req.body);
       CrudDBFunctions.insertOneDocument('mcqs',req.body,(result,err='')=>{
           if(err){
               res.status(200).json({errorMessage: JSON.stringify(err)});
           }else {
               console.log("mcq Save result",result.result);
               res.status(200).json(result.insertedId);
           }
       });
    } catch (e) {
        res.status(403).json({errorMessage: e.toString()});
    }
});

router.post('/modifyMCQ', (req, res) => {
    console.log(req.body);
    let {documentToUpdate,updateToMake}={...req.body};
    CrudDBFunctions.updateOneDocumentById('mcqs',documentToUpdate,updateToMake,(result,err='')=>{
        if(err){
            console.log("error updating mcq",err);
            res.status(403).json({errorMessage:"update Failed! "+JSON.stringify(err)});
        }else {
            console.log("result of updare process",result);
            res.status(200).json(result);
        }
    })

});

router.post('/getMCQsOfLevel', (req, res) => {
    let {reference}={...req.body};
    CrudDBFunctions.getAllDocument({
        collection:'mcqs',
        options:{
            queries:{
                reference:reference
            }
        },
        callback:(result,err='')=>{
            if(err){
                console.log("error while fetching MCQS",err);
                res.status(403).json({errorMessage:JSON.stringify(err)});
            }else {
                res.status(200).json(result);
            }
        }
    })
});

router.post('/newTest', (req, res) => {
    CrudDBFunctions.insertOneDocument(
        'tests',
        req.body,
        (result,err='')=>{
            if(err){
                console.log("error while fetching MCQS",err);
                res.status(403).json({errorMessage:JSON.stringify(err)})
            }else {
                console.log("one Saved Test returned",result);
                res.status(200).json(result.insertedId);
            }
        }
    )
});

router.post('/modifyTest', (req, res) => {
    console.log("about to modify a test",req.body);
    let {document,updates}={...req.body};
    CrudDBFunctions.updateOneDocumentById(
        'tests',
        document,
        updates,
        (result,err='')=>{
            if(err){
                console.log("error updating test ",err);
                res.status(403).json({errorMessage:JSON.stringify(err)})
            }else{
                console.log("one updated Test returned",result);
                res.status(200).json(result);
            }
        }
    );
});

router.post('/getTestsOfLevel',(req,res)=>{
    let {reference,course_level}={...req.body};
    let   aggregation = [
        {
            $match: {
                reference: reference,
                course_level:course_level
            }
        },
        {
            $graphLookup: {
                from: 'mcqs',
                startWith: '$selectedmcqs_ids',
                connectFromField: 'selectedmcqs_ids',
                connectToField: "_id",
                as: 'mcqs',
            }
        },
    ];

    CrudDBFunctions.getOneDocumentWithAggregation('tests',aggregation,(result,err='')=>{
        if(err){
            console.log("error while request for test ",err);
            res.status(403).json({errorMessage: JSON.stringify(err)});
        }else {
            console.log("test returned",result);

            res.status(200).json(result);
        }
    });
});

module.exports = router;