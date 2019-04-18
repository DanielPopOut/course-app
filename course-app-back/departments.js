let express = require('express');
let router = express.Router();
let CrudDBFunctions = require('./CrudDBFunctions');

const ObjectID = require('mongodb').ObjectID;

let  aggregation = [
    {
        $graphLookup: {
            from: 'specialities',
            startWith: '$_id',
            connectFromField: '_id',
            connectToField: "department",
            as: 'specialities',
        }
    }

];

router.get('/getAll', (req, res) =>
    CrudDBFunctions.getOneDocumentWithAggregation("departments", aggregation,
        (result, err = '') => {
        if (err) {
            res.status(400).json({errorMessage: err.toString()});
        } else {
            console.log("result dep aggregation ",result);
            res.status(200).json(result);
        }
    })
);

module.exports = router;