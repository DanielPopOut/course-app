const jwt = require('jsonwebtoken');

let express = require('express');
let router = express.Router();
let CrudDBFunctions = require('./CrudDBFunctions');
let TokenFunctions = require('./token');
const ObjectID = require('mongodb').ObjectID;



/**
 * section creation of a new course subelement (chapter, section , subsection)
 */
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

router.post('/getAllWithIds', (req, res) => {
    console.log("get all with ids body ",req.body);
    let {collection, elements_ids, fields} = {...req.body};
    elements_ids=elements_ids.map(
        (id)=>{
            return ObjectID(id);
        });
    CrudDBFunctions.getAllDocument({
        collection: collection,
        options: {
            queries: {
                _id: {$in: elements_ids}
            },
            fields: fields||{}
        },
        callback: (result, err = "") => {
            if (err) {
                console.log("error occured ",err);
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

router.post('/newMessage', (req, res) => {
    try {
        console.log("rea body ", req.body);
        CrudDBFunctions.insertOneDocument(
          'contactsmessages',
          req.body,
            (result,err="")=>{
              if(err){

              }else {

              }
            }
        );
    } catch (e) {
        res.status(403).json({errorMessage: e.toString()});
    }
});

router.post('/answerToMessage', (req, res) => {
    try {

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

/**
 * section for course retrieve
 */

router.post('/getCourse', (req, res) => {
    let { course_id,onlyTitle} = {...req.body};
    retrieveElements([course_id], 'courses', (course_result, err = '') => {
        if (err) {
            console.log("Error fetching Course", err);
            res.status(403).json({
                errorMessage: "Error fetching Course " + JSON.stringify(err)
            });
        } else {
            let course = course_result[0];
            //=course['chapters'].reverse();
            res.status(200).json(course);
        }
    },onlyTitle).then();
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

module.exports = router;