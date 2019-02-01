import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import './courses.css';

import {ButtonHelper, InputTextHelper} from "../HelperComponent/FormHelper";
import Redirect from "react-router-dom/es/Redirect";
import RegisterForCourse from "./RegisterForCourse";

const courseslist = [
    {
        '_id':1,
        title:"course title ",
        description: "description description" +
        " description description description " +
        "description "
    },
    {
        '_id':2,
        title:"course title",
        description: "description description" +
        " description description description description" +
        " description description ar8gpgipi description description description " +
        "description "
    }, {
        '_id':3,
        title:"course title",
        description: "description description" +
        " description description description description" +
        " description description ar8gpgipi description description description " +
        "description "
    }, {
        '_id':4,
        title:"course titlecourse titlecourse title verugfery goygworgo 8g7o348 qo48gq 74go34879goq84g87g847goq4 87gq",
        description: "description description" +
        " description description description description" +
        " description description ar8gpgipi description description description " +
        "description "
    },
    {
        '_id':5,
        title:"course title",
        description: "description description" +
        " description description description " +
        "description "
    }
];
let userConnected={
    _id:'diirgwr5g7rwerue9r8e8',
    name:'a name',
    surname:'a surname'
};


class CoursesHeader extends Component{
    render(){
        console.log("autre: ",this.props);

        let buttonnewuser={
            name:"newuserbutton",
            value:"Ajouter un cours",
            className:"form-helper-button success"
        };
        let inputsearchparams={
            type:'text',
            name : 'input-course-search',
            className : "search-input form-helper-input ",
            placeholder :'Search'
        };
        return(
            <React.Fragment>
                <div className={"users-interface-header"}>
                    <h3>{"Courses Management Interface !!"} </h3>
                </div>
                <div className={"user-search-new-div"}>
                    <div className={"div-user-search-block"}>
                        <InputTextHelper {...inputsearchparams}
                                         onChange={(e)=>this.handleChange(e)}
                        />
                        <div className={"div-img-search"}>
                            <img src={"/images/search.jpg"}
                                 alt={"Search"}
                                 onClick={(e)=>this.handleValidateSearch(e)}
                                 className={"button-image-user-search"}/>
                        </div>
                    </div>
                    <div className={'new-user-button'}>
                        <ButtonHelper {...buttonnewuser} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

class CoursesList extends Component{
    constructor(props){
        //console.log("init: ",props);
        super(props);
        this.state={
            dataToShow:courseslist,
        }
    }

    register(course){
        if(userConnected.hasOwnProperty('student')){
            userConnected.student.push(course._id);
            console.log('userConnected',userConnected);
        }else {
            let student=[];
            student.push(course._id);
            userConnected.student=student;
            console.log('userConnected',userConnected);
        }
        return (true);
    }
    unregister(course){
        userConnected.student=userConnected.student.filter((value)=>{return(value!==course._id)});
        console.log('userConnected',userConnected);
        return (true);
    }
    handleClick(course){

        this.props.openCourse(course);
    }

    render(){
        return(
            <div className={'courses-list-div'}>
                {
                    this.state.dataToShow.map((course,key)=>{
                       return(
                           <div key={key} onClick={(e)=>this.handleClick(course)} className={'course-item col-3 tooltip'}>
                               <div>
                                   <img src={"images/prem_couv.jpg"}  className={'course-cover-image'} alt={'Premiere de couverture'}/>
                                   <div className={"course-description"}>
                                       {course.description}
                                   </div>
                               </div>
                               <div className={"course-title"}>{course.title}</div>
                               <div className={"tooltip-content"} onClick={e=>e.stopPropagation()}>
                                   <RegisterForCourse course={course}
                                                      register={()=>this.register(course)}
                                                      unregister={()=>this.unregister(course)}                                                         register={()=>this.register(course)
                                                      }
                                   />
                               </div>
                           </div>
                       )
                    })
                }
            </div>
            /* <DataManagerPage {...coursesModel}/>*/
        );
    }
}


class CoursesFooter extends Component{
    render(){
        return(
            <div>


            </div>
        )
    }

}

class Courses extends Component {
    constructor(props){
        super(props);
        this.state={

        }
    }

    handleOpenCourse(course){
        console.log("here");
        console.log(this.props);
        this.props.history.push('/course/'+course._id);
    }
    render() {
        console.log("1 courses: ",this.props);

        return (
            <React.Fragment>
                <CoursesHeader/>
                <CoursesList openCourse={(course)=>this.handleOpenCourse(course)}/>
                <CoursesFooter/>
            </React.Fragment>
        );
    }
}

export default Courses;

