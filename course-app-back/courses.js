let express = require('express');
let router = express.Router();
let DBFunctions=require('./basicDBFunction');


router.post('/newStudent', (req, res) => {
    consol.log('new student for a course');

    res.status(200).json({message:"Teacher successfully added"})
});
router.post('/addTeacher',(req,res)=>{

});
router.post('removeTeacher',(res,req)=>{

});


module.exports = router;