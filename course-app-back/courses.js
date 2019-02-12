let express = require('express');
let router = express.Router();
let CrudDBFunctions = require('./CrudDBFunctions');
const ObjectID = require('mongodb').ObjectID;


let lowerLevelCollectionName = {
    courses: 'chapters',
    chapters: 'sections',
    sections: 'subsections'
};


router.post('/newSubElement', (req, res) => {
    let {element,childelement}={...req.body};
    let {elementName, elementProperties}={...element};
    childelement[elementName]=elementProperties._id;//assign the parent node id
    elementName=elementName+'s';
    console.log("element is this ",element);
    CrudDBFunctions.insertOneDocument(
        lowerLevelCollectionName[elementName],
        childelement,
        (result,err='')=>{
            if(err){
                res.status(400).json({errorMessage:lowerLevelCollectionName[elementName]+" Creation failed"})
            }else {
                let subInsertedElementId = result.insertedId;
                CrudDBFunctions.getOneDocument({
                    collection: elementName,
                    options: {
                        queries:{ _id:ObjectID(elementProperties._id)},
                        fields: {elementName}
                    },
                    callback: (result,err="")=>{
                        if(err){
                            res.status(400).json({errorMessage:"Error Fetching Sub Elements"});
                        }else {
                            console.log("elementInserted id", subInsertedElementId);
                            console.log("element returned ",result);
                            //return (result);
                            let changes=[];
                            let newChildren=result[lowerLevelCollectionName[elementName]];//.push(result.insertedId);
                            console.log("new children before push ",newChildren);
                            newChildren.push(ObjectID(subInsertedElementId));
                            console.log("children after push ",newChildren);
                            changes[lowerLevelCollectionName[elementName]]=newChildren;
                            CrudDBFunctions.updateOneDocumentById(
                                elementName,
                                elementProperties,
                                changes,
                                (result,err="")=>{
                                    if(err){
                                        res.status(400).json({errorMessage:"Element "+elementName+" updated Failed"});
                                    }else {
                                        console.log("update result", result.result);
                                        res.status(200).json(childelement);
                                    }
                                });
                        }
                    }
                });
            }
        });

});
router.post('/addTeacher',(req,res)=>{

});
router.post('removeTeacher',(res,req)=>{

});


module.exports = router;