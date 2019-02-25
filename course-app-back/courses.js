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
let returnAggregation = function (element_id) {
    let aggregation = [
        {$match: {_id: ObjectID(element_id),}},
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
        {
            $sort: {
                chapters: 1
            }},
        {
            $group: {
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

let getSubSection =  (subsection_id) => {
     CrudDBFunctions.getOneDocument({
        collection: "subsections",
        options: {
            queries: {
                _id: ObjectID(subsection_id)
            }
        },
        callback: (result, err) => {
            if (err) {
                //callback(result,err);
            } else {
                return(result);
            }
        }
    });
};
let getSection =  (section_id, callback) => {
     CrudDBFunctions.getOneDocument({
        collection: "sections",
        options: {
            queries: {
                _id: ObjectID(section_id)
            }
        },
        callback: (result, err) => {
            if (err) {
                callback(result, err);
            } else {

                result['subsections'] = result['subsections'].map(
                     (subsection_id) => {

                         //let theresult={};
                          return getSubSection(subsection_id/*, (sub_section_result, err = '') => {
                            if (err) {
                                console.log("error getting subsection ", err);
                            } else {
                                console.log("sub-section founded", sub_section_result);
                                theresult = sub_section_result;
                                //return sub_section_result;
                            }
                              console.log("the result", sub_section_result);
                        }*/);
                    });
                callback(result);
            }
        }
    });
};

async function getChapters(chapters_ids) {
    return CrudDBFunctions.getAllDocument({
        collection: "chapters",
        options: {
            queries: {
                _id: {$in:chapters_ids}
            }
        },
        callback: (chapters_result, err) => {
            if (err) {
                console.log("error getting chapters",err);
            } else {
                return(chapters_result);
            }
        }
    });
};
async function getSections(sections_ids){
    let final;

}

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

router.post('/getCourse', async (req, res) => {
    let course_id=req.body._id;
    await CrudDBFunctions.getOneDocument({
        collection: "courses",
        options: {
            queries: {
                _id: ObjectID(course_id)
            }
        },
        callback:async  (course_result, err = '') => {
            if (err) {
                console.log("Error fetching Course", err);
                //callback({},err);
            } else {
                let chapters_ids = course_result['chapters'];
                 course_result['chapters']= await getChapters(chapters_ids);
                console.log("course result ",course_result);
                res.status(200).json(course_result);
            }
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