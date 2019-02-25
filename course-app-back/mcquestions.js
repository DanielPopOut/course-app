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
               res.status(200).json(result);
           }
       });
    } catch (e) {
        res.status(403).json({errorMessage: e.toString()});
    }
});

router.post('/modifyMCQ', (req, res) => {
   
});

router.post('/showMCQ', (req, res) => {
    
});

router.post('/generateATest', (req, res) => {
   
});


module.exports = router;