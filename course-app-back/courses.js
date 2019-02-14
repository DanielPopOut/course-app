const jwt = require('jsonwebtoken');

let express = require('express');
let router = express.Router();
let CrudDBFunctions = require('./CrudDBFunctions');
let TokenFunctions = require('./token');
const ObjectID = require('mongodb').ObjectID;

let lowerLevelCollectionName = {
    courses: 'chapters',
    chapters: 'sections',
    sections: 'subsections'
};

router.get('/getAll',(req,res)=>{
    CrudDBFunctions.getAllDocument({
        collection:'courses',
        callback:(result,err="")=>{
            if(err){
                res.status(400).json({errorMessage:err.toString()});
            }else {
                res.status(200).send(result);
            }
        }
    });
});

router.post('/newRegistration',(req,res)=>{
    try {
        console.log("rea body ",req.body);
        let {token,course}={...req.body};
        console.log("token",token);
        TokenFunctions.verify(token, (err,decoded)=> {
            if(err){
                console.log("token verification",JSON.stringify(err));
                res.status(403).json({errorMessage:" token Verification : "+JSON.stringify(err)});
            }else {
                let student=[];
                let user = decoded;
                delete  user['iat'];
                delete  user['exp'];
                console.log("user before : ",user);
                console.log("course_id",course._id);
                if(user.hasOwnProperty('student')){
                    student=user.student;
                    student.push(course._id);
                }else {
                    student.push(course._id);
                }
                CrudDBFunctions.updateOneDocumentById(
                    'users',
                    user,
                    {student:student},
                    (result,err="")=>{
                        if(err){
                            res.status(403).json({errorMessage:JSON.stringify({'':"user update failed ",error:err.toString()})})
                        }else {
                            user['student']=student;
                            console.log('New User',user);
                            let newtoken=TokenFunctions.generateToken(user);
                            res.status(200).json(newtoken);
                        }
                    });
            }
        });
    }catch (e) {
        res.status(403).json({errorMessage:e.toString()});
    }
});

router.post('/cancelRegistration',(req,res)=>{
    try {
        console.log("rea body ",req.body);
        let {token,course}={...req.body};
        TokenFunctions.verify(token, (err,decoded)=> {
            if(err){
                console.log("token verification",JSON.stringify(err));
                res.status(403).json({errorMessage:" token Verification : "+JSON.stringify(err)});
            }else {
                console.log("decoded Token ",decoded);
                let user = decoded;
                delete  user['iat'];
                delete  user['exp'];
                let student=[];
                if(user.hasOwnProperty('student')){
                    student=user['student'].filter((value)=>{return(value!==course._id)});
                }
                console.log("student after one removed ",student);
                CrudDBFunctions.updateOneDocumentById(
                    'users',
                    user,
                    {student:student},
                    (result,err="")=>{
                        if(err){
                            res.status(403).json({errorMessage:JSON.stringify({'':"user update failed ",error:err.toString()})})
                        }else {
                            user['student']=student;
                            console.log('New User',user);
                            let newtoken=TokenFunctions.generateToken(user);
                            res.status(200).json(newtoken);
                        }
                    });
            }
        });
    }catch (e) {
        res.status(403).json({errorMessage:e.toString()});
    }
});

router.post('/getCourse',(req,res)=>{
    console.log("course required ",req.body);
    CrudDBFunctions.getOneDocument({
        collection:'courses',
        options:{
            queries:{
                _id:ObjectID(req.body._id)
            }
        },
        callback: (result,err="")=>{
            if(err){
                res.status(403).json({errorMessage:""+JSON.stringify(err)});
            }else {
                console.log("the course sended ",result);

                res.status(200).json(result);
            }
        }
    });
});

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

module.exports = router;