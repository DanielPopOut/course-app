const express = require('express');
const app = express();
const port = 7221;
const cors = require('cors');
const bodyParser = require('body-parser');

const cruds = require('./cruds');
const authentication = require('./authentication');
const courses = require('./courses');
const departments = require('./departments');
const contacts = require('./contacts');
const MCQuestions = require('./mcquestions');

let CrudDBFunctions=require('./CrudDBFunctions');
let TokenFunctions = require('./token');


app.use(cors());
// parse application/json
app.use(bodyParser.json({limit: '10mb'}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true,limit: '10mb'}));



// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

app.use(function (req, res, next) {
    // console.info(`${req.method} ${req.originalUrl}`);
    next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/finduserswithemails',(req,res)=>{
    //console.log("req query "+JSON.stringify(req.query));
    let options= {
            queries:{
                email:{$in:req.body}
            }
        };
   CrudDBFunctions.getAllDocument({
       collection: 'users',
       options: options,
       callback: (result,err='')=>{
           if(err){
               console.log('error',err);
               res.status(500).send({errorMessage:"User List Could not be returned !!"});
           }else{
               res.status(200).send(result);
           }
       }
   });
});

app.post('/*', (req,res,next)=>{

    // console.log(req);
    // console.log('voiciiiiii');
    next()
});
app.use('/authentication', authentication);
app.use('/crudOperations', cruds);
app.use('/departments', departments);
app.use('/courses', courses);
app.use('/mcquestions', MCQuestions);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
