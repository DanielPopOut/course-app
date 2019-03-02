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

let returnAggregation = function (course_id) {
    let aggregation = [
        {$match: {_id: ObjectID(course_id),}},
        {
            $graphLookup: {
                from: 'chapters',
                startWith: '$chapters',
                connectFromField: 'chapters',
                connectToField: "_id",
                as: 'chapters',
            }
        },
        {
            $unwind: {
                path: '$chapters', preserveNullAndEmptyArrays: true,
            }},
        {
            $graphLookup: {
                from: 'sections',
                startWith: '$chapters.sections',
                connectFromField: "chapters.sections",
                connectToField: "_id",
                as: 'chapters.sections'
            }
        },

        {    $group: {
                _id: '$_id',
                title: {$first: "$title"},
                content: {$first: "$content"},
                chapters: {$push: "$chapters"}
            }
        },
    ];
    return aggregation;
};
const retrieveElement = async (element_id, collection = 'courses', callback) => {
    let aggregation = returnAggregation(element_id, collection);
    await CrudDBFunctions.getOneDocumentWithAggregation(collection, aggregation, async (result, err = '') => {
        callback(result, err);
    });
};

router.post('/getCourseElements', (req, res) =>{
    console.log("request body ",req.body);
    let {elements_ids,elements_collection}={...req.body};
    elements_ids=elements_ids.map((id)=>{
       return ObjectID(id);
    });
    CrudDBFunctions.getAllDocument({
        collection: 'courses',
        options: {
            queries: {
                _id: {$in: elements_ids}
            }
        },
        callback: (result, err = '') => {
            if (err) {
                res.status(403).json({errorMessage: JSON.stringify(err)});
            } else{
                console.log("result ",result);
                res.status(200).json(result);
            }
        }
    });
});

router.get('/getAll', (req, res) => {
    CrudDBFunctions.getAllDocument({
        collection: 'courses',
        callback: (result, err = "") => {
            if (err) {
                res.status(400).json({errorMessage: err.toString()});
            } else {
                res.status(200).send(result);
            }
        }
    });
});

router.post('/newRegistration', (req, res) => {
    try {
        console.log("rea body ", req.body);
        let {token, course} = {...req.body};
        console.log("token", token);
        TokenFunctions.verify(token, (err, decoded) => {
            if (err) {
                console.log("token verification", JSON.stringify(err));
                res.status(403).json({errorMessage: " token Verification : " + JSON.stringify(err)});
            } else {
                let student = [];
                let user = decoded;
                delete  user['iat'];
                delete  user['exp'];
                console.log("user before : ", user);
                console.log("course_id", course._id);
                if (user.hasOwnProperty('student')) {
                    student = user.student;
                    student.push(course._id);
                } else {
                    student.push(course._id);
                }
                CrudDBFunctions.updateOneDocumentById(
                    'users',
                    user,
                    {student: student},
                    (result, err = "") => {
                        if (err) {
                            res.status(403).json({
                                errorMessage: JSON.stringify({
                                    '': "user update failed ",
                                    error: err.toString()
                                })
                            })
                        } else {
                            user['student'] = student;
                            console.log('New User', user);
                            let newtoken = TokenFunctions.generateToken(user);
                            res.status(200).json(newtoken);
                        }
                    });
            }
        });
    } catch (e) {
        res.status(403).json({errorMessage: e.toString()});
    }
});

router.post('/cancelRegistration', (req, res) => {
    try {
        console.log("rea body ", req.body);
        let {token, course} = {...req.body};
        TokenFunctions.verify(token, (err, decoded) => {
            if (err) {
                console.log("token verification", JSON.stringify(err));
                res.status(403).json({errorMessage: " token Verification : " + JSON.stringify(err)});
            } else {
                console.log("decoded Token ", decoded);
                let user = decoded;
                delete  user['iat'];
                delete  user['exp'];
                let student = [];
                if (user.hasOwnProperty('student')) {
                    student = user['student'].filter((value) => {
                        return (value !== course._id)
                    });
                }
                console.log("student after one removed ", student);
                CrudDBFunctions.updateOneDocumentById(
                    'users',
                    user,
                    {student: student},
                    (result, err = "") => {
                        if (err) {
                            res.status(403).json({
                                errorMessage: JSON.stringify({
                                    '': "user update failed ",
                                    error: err.toString()
                                })
                            })
                        } else {
                            user['student'] = student;
                            console.log('New User', user);
                            let newtoken = TokenFunctions.generateToken(user);
                            res.status(200).json(newtoken);
                        }
                    });
            }
        });
    } catch (e) {
        res.status(403).json({errorMessage: e.toString()});
    }
});

router.post('/addTeacher', (req, res) => {
    try {
        console.log("rea body ", req.body);
        let {user, course} = {...req.body};
        console.log("parameters ", {user, course});
        let teacher = [];
        if (user.hasOwnProperty('teacher')) {
            teacher = user.teacher;
            teacher.push(course._id);
        } else {
            teacher.push(course._id);
        }
        CrudDBFunctions.updateOneDocumentById(
            'users',
            user,
            {teacher: teacher},
            (result, err = "") => {
                if (err) {
                    res.status(403).json({
                        errorMessage: JSON.stringify({
                            '': "user update failed ",
                            error: err.toString()
                        })
                    })
                } else {
                    if (result.result.nMatched === 0) {
                        res.status(403).json({errorMessage: " user No Found on Server !!"});
                    }
                    res.status(200).json({message: "Teacher Added successfully"});
                }
            });
    } catch (e) {
        res.status(403).json({errorMessage: e.toString()});
    }
});

router.post('/removeTeacher', (req, res) => {
    try {
        console.log("rea body ", req.body);
        let {user, course} = {...req.body}
        console.log("parameters ", {user, course});
        let teacher = [];
        if (user.hasOwnProperty('teacher')) {
            teacher = user['teacher'].filter((value) => {
                return (value !== course._id)
            });
        }
        CrudDBFunctions.updateOneDocumentById(
            'users',
            user,
            {teacher: teacher},
            (result, err = "") => {
                if (err) {
                    res.status(403).json({
                        errorMessage: JSON.stringify({
                            '': "user update failed ",
                            error: err.toString()
                        })
                    })
                } else {
                    res.status(200).json({message: "Teacher removed succesfully"});
                }
            });
    } catch (e) {
        res.status(403).json({errorMessage: e.toString()});
    }
});

router.post('/getCourse', (req, res) => {
    let course_id=req.body._id;
    retrieveElement(req.body._id,'courses',(course_result,err='')=>{
        if(err){
            console.log("Error fetching Course", err);
            res.status(403).json({
                errorMessage:"Error fetching Course "+JSON.stringify(err)
            });
        }else {
            let course=course_result[0];
            course['chapters'].forEach( (chapter,index)=>{
               chapter['sections'] = chapter['sections'].reverse();
               /* chapter['sections'].forEach(
                   (section,index)=>{
                       let subsection_ids = section['subsections'];
                       let subsections=[];

                        CrudDBFunctions.getAllDocument({
                          collection:'subsections',
                          options:{
                              queries:{
                                  _id:{$in:subsection_ids}
                              }
                          },
                           callback: (result,err='')=>{
                              if(err){
                                  console.log("yes error",err);
                              }else {
                                  subsections=result;
                                  section['subsections']=subsections;
                              }
                           }
                       });
                       console.log("SubSections ",subsections);
               });*/
               return chapter;
            });
            course['chapters'].reverse();
            //=course['chapters'].reverse();
            res.status(200).json(course);
        }
    });
});

router.post('/newSubElement', (req, res) => {
    let {element, childelement} = {...req.body};
    let {elementName, elementProperties} = {...element};
    childelement[elementName] = elementProperties._id;//assign the parent node id
    elementName = elementName + 's';
    console.log("element is this ", element);
    CrudDBFunctions.insertOneDocument(
        lowerLevelCollectionName[elementName],
        childelement,
        (result, err = '') => {
            if (err) {
                res.status(400).json({errorMessage: lowerLevelCollectionName[elementName] + " Creation failed"})
            } else {
                let subInsertedElementId = result.insertedId;
                CrudDBFunctions.getOneDocument({
                    collection: elementName,
                    options: {
                        queries: {_id: ObjectID(elementProperties._id)},
                        fields: {elementName}
                    },
                    callback: (result, err = "") => {
                        if (err) {
                            res.status(400).json({errorMessage: "Error Fetching Sub Elements"});
                        } else {
                            console.log("elementInserted id", subInsertedElementId);
                            console.log("element returned ", result);
                            //return (result);
                            let changes = [];
                            let newChildren = result[lowerLevelCollectionName[elementName]];//.push(result.insertedId);
                            console.log("new children before push ", newChildren);
                            newChildren.push(ObjectID(subInsertedElementId));
                            console.log("children after push ", newChildren);
                            changes[lowerLevelCollectionName[elementName]] = newChildren;
                            CrudDBFunctions.updateOneDocumentById(
                                elementName,
                                elementProperties,
                                changes,
                                (result, err = "") => {
                                    if (err) {
                                        res.status(400).json({errorMessage: "Element " + elementName + " updated Failed"});
                                    } else {
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

router.post('/getUsers', (req, res) => {
    console.log("request body ", req.body);
    CrudDBFunctions.getAllDocument({
        collection: 'users',
        options: {
            queries: {
                email: {$in: req.body.emails}
            }
        },
        callback: (result, err = '') => {
            if (err) {
                res.status(403).json({errorMessage: JSON.stringify(err)});
            } else {
                res.status(200).json(result);
            }
        }
    });
});


module.exports = router;