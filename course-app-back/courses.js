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

let returnAggregation = function (elements_ids, level = 'chapters', onlyTitle = false) {
    let aggregation = [];
    elements_ids = elements_ids.map((id) => {
        return ObjectID(id);
    });

    if (level === 'chapters') {
        aggregation = [
            {$match: {_id: {$in: elements_ids},deleted:{$exists:false}}},
            {
                $graphLookup: {
                    from: 'sections',
                    startWith: '$sections',
                    connectFromField: 'sections',
                    connectToField: "_id",
                    as: 'sections',
                }
            },
            {
                $unwind: {
                    path: '$sections', preserveNullAndEmptyArrays: true,
                }
            },
            {
                $graphLookup: {
                    from: 'subsections',
                    startWith: '$sections.subsections',
                    connectFromField: "sections.subsections",
                    connectToField: "_id",
                    as: 'sections.subsections'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    title: {$first: "$title"},
                    content: {$first: "$content"},
                    sections: {$push: "$sections"}
                }
            },
        ];
    } else if (level === 'sections') {
        aggregation = [
            {$match: {_id: {$in: elements_ids},deleted:{$exists:false}}},
            {
                $graphLookup: {
                    from: 'subsections',
                    startWith: '$subsections',
                    connectFromField: 'subsections',
                    connectToField: "_id",
                    as: 'subsections',
                }
            }
        ];
    } else {
        aggregation = [{$match: {_id: {$in: elements_ids},deleted:{$exists:false}}},];
    }
    if (onlyTitle) {
        aggregation.push({
            $project:
                {
                    _id: 1,
                    title: 1,
                    "sections._id": 1,
                    "sections.title": 1,
                    "sections.subsections._id": 1,
                    "sections.subsections.title": 1,
                }
        });
    }
    return aggregation;
};

const retrieveElements = async (elements_ids, collection = 'courses', callback, onlyTitle) => {
    let aggregation = returnAggregation(elements_ids, collection, onlyTitle);
    await CrudDBFunctions.getDocumentsWithAggregation(collection, aggregation, (result, err = '') => {
        callback(result, err);
    });
};

/**
 * section creation of a new course subelement (chapter, section , subsection)
 */

router.post('/newSubElement', (req, res) => {
    console.log("subelement req Body", req.body);
    let {element, childelement} = {...req.body};
    let {elementName, elementProperties} = {...element};
    childelement[elementName] = elementProperties._id;//assign the parent node id
    elementName = elementName + 's';
    //console.log("element is this ", element);
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
                           console.log("Adding Error", err);
                            res.status(400).json({errorMessage: "Error Fetching Sub Elements"});
                        } else {
                            let changes = [];
                            let newChildren = result[lowerLevelCollectionName[elementName]] || [];//.push(result.insertedId);
                            newChildren.push(ObjectID(subInsertedElementId));
                            changes[lowerLevelCollectionName[elementName]] = newChildren;
                            console.log("changes ",changes);
                            CrudDBFunctions.replaceOneDocumentById(
                                elementName,
                                Object.assign({},elementProperties,changes),
                                (result, err = "") => {
                                    if (err) {
                                        console.log("replacement error",err);
                                        res.status(400).json({errorMessage: "Element " + elementName + " updated Failed"});
                                    } else {
                                       console.log("result", result);
                                       console.log("child element", childelement);
                                        res.status(200).json(childelement);
                                    }
                                });
                        }
                    }
                });
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

router.get('/getCoursesByDepartment', (req, res) => {
    CrudDBFunctions.getDocumentsWithAggregation(
        "courses",
        [
            {
                $group:{
                    _id: "$speciality._id",
                    speciality:{$first:"$speciality"},
                    department:{$first:"$department"},
                    courses:{$push:{
                            _id:"$_id",
                            title: "$title",
                            level:"$level"
                        }}
                }
            },
            {
                $group:{
                    _id: "$department._id",
                    department: {  $first: "$department"},
                    specialities:{
                        $push:{
                            speciality:"$speciality",
                            courses:"$courses"
                        }
                    }
                }
            }

        ],
        (result,err="")=>{
            if(err){
                console.log("couldn't find documents",err);
                res.status(200).json({errorMessage:"Sorry, couldn't find documents !!"});
            }else {
                console.log("docoments returned",result);
                res.status(200).json(result);
            }
        });
});

router.post('/getAllWithIds', (req, res) => {
    console.log("get all with ids body ", req.body);
    let {collection, elements_ids, fields} = {...req.body};
    elements_ids = elements_ids.map(
        (id) => {
            return ObjectID(id);
        });
    CrudDBFunctions.getAllDocument({
        collection: collection,
        options: {
            queries: {
                _id: {$in: elements_ids}
            },
            fields: fields || {}
        },
        callback: (result, err = "") => {
            if (err) {
                console.log("error occured ", err);
                res.status(400).json({errorMessage: err.toString()});
            } else {
                res.status(200).send(result);
            }
        }
    });
});

/**
 * section of registration of users as students
 */

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

/**
 * Section of registration inscription of users as teacher of a course
 */

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
        let {user, course} = {...req.body};
        console.log("parameters ", {user, course});
        let teacher = [];
        if (user.hasOwnProperty('teacher')) {
            teacher = user['teacher'].filter((value) => {
                return (value !== course._id);
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

router.post('/getUsers', (req, res) => {
    console.log("request body ", req.body);
    CrudDBFunctions.findAllDocument({
        collection: 'users',
        options: {
            $or: [
                {email: {$regex: ".*" + req.body.emails + ".*", $options: "i"}},
                {name: {$regex: ".*" + req.body.emails + ".*", $options: "i"}},
                {surname: {$regex: ".*" + req.body.emails + ".*", $options: "i"}},
                {pseudo: {$regex: ".*" + req.body.emails + ".*", $options: "i"}},
            ]
        },
        callback: (result, err = '') => {
            if (err) {
                res.status(403).json({errorMessage: JSON.stringify(err)});
            } else {
                console.log("result ",result);
                res.status(200).json(result);
            }
        }
    });
});

/**
 * section for course retrieve
 */

router.post('/getCourse', (req, res) => {
    let {course_id, onlyTitle} = {...req.body};
    retrieveElements([course_id], 'courses', (course_result, err = '') => {
        if (err) {
            console.log("Error fetching Course", err);
            res.status(403).json({
                errorMessage: "Error fetching Course " + JSON.stringify(err)
            });
        } else {
            let course = course_result[0];
            res.status(200).json(course);
        }
    }, onlyTitle).then();
});

router.post('/getCourseElements', (req, res) => {
    console.log("request body ", req.body);
    let {elements_ids, elements_collection, onlyTitle} = {...req.body};
    elements_ids = elements_ids.map((id) => {
        return ObjectID(id);
    });

    retrieveElements(elements_ids, elements_collection, (result, err = '') => {
        if (err) {
            console.log("error getting sub Elements ", err);
            res.status(403).json({errorMessage: JSON.stringify(err)});
        } else {
            //reversing sub-elements that have been inverse due to aggregation
            if (elements_collection === 'chapters') {
                console.log("chapters result ", result);
                result.reverse();
                result.forEach((chapter) => {
                    if (chapter.hasOwnProperty('sections')) {
                        chapter['sections'].reverse();
                        chapter['sections'].forEach((section) => {
                            console.log("section", section);
                            if (section.hasOwnProperty('subsections')) {
                                section['subsections'].reverse();
                            }
                        });
                    }
                });
            } else if (elements_collection === 'sections') {
                result.forEach((section) => {
                    if (section.hasOwnProperty('subsections')) {
                        section['subsections'].reverse();
                    }
                });
            }
            console.log("result ", result);
            res.status(200).json(result);
        }
    }, onlyTitle);
});

router.post('/getHoleCourse', (req, res) => {
    CrudDBFunctions.getOneDocument({
       collection:"courses",
       options:{
           queries:{
               _id:ObjectID(req.body.course)
           }
       },
        callback:(course,err="")=>{
           if(err){
               console.log("Error fetching Course", err);
               res.status(403).json({
                   errorMessage: "Error getting Course "
               });
           }else {
               if(course.hasOwnProperty("chapters") && course["chapters"].length>0){
                   retrieveElements(course["chapters"],"chapters", (result, err = '') => {
                       if (err) {
                           console.log("error getting sub Elements ", err);
                           res.status(403).json({errorMessage: JSON.stringify(err)});
                       } else {
                           console.log("chapters result ", result);
                           result.reverse();
                           result.forEach((chapter) => {
                               if (chapter.hasOwnProperty('sections')) {
                                   chapter['sections'].reverse();
                                   chapter['sections'].forEach((section) => {
                                       console.log("section", section);
                                       if (section.hasOwnProperty('subsections')) {
                                           section['subsections'].reverse();
                                       }
                                   });
                               }
                           });
                           console.log("result ", result);
                           course["chapters"]=result;
                           res.status(200).json(course);
                       }
                   });

               }else {
                   res.status(200).json(course);
               }
           }
        }
    });

});

/**
 * findCourse function
 * return courses which title like parameter
 * @type {Router|router|*}
 */

router.post("/findCourses",(req,res)=>{
    console.log("req body",req.body);
    CrudDBFunctions.findAllDocument({
        collection: "courses",
        options: {title:{$regex:".*"+req.body.data+"*.",$options:'i'}},
        callback: (result, err = '') => {
            if (err) {
                console.log('error', err);
                res.status(400).send({message: "error"});
            } else {
                console.log(result.length, ' elements returned ');
                //res.status(200).json(JSON.stringify(result));
                res.status(200).json(result);
            }
        }
    });
});



module.exports = router;