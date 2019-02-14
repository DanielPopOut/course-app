import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import './courses.css';

import {ButtonHelper, InputTextHelper} from "../HelperComponent/FormHelper";
import RegisterForCourse from "./RegisterForCourse";
import {getToken, getDecodedToken, setToken} from '../../server/axiosInstance';
import {ServerService} from "../../server/ServerService";

class CoursesHeader extends Component{

    handleChange(e){

    }

    render(){
       // console.log("autre: ",this.props);

        let buttonnewcourse={
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
                        <InputTextHelper {...inputsearchparams} onChange={(e)=>this.handleChange(e)} />
                        <div className={"div-img-search"}>
                            <img src={"/images/search.png"}
                                 alt={"Search"}
                                 onClick={(e)=>this.handleValidateSearch(e)}
                                 className={"button-image-user-search"}/>
                        </div>
                    </div>
                    <div className={'new-user-button'}>
                        <ButtonHelper {...buttonnewcourse} />
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
            dataToShow:[],
        }
    }

    componentDidMount(){
        ServerService.getFromServer('courses/getAll').then((response)=>{
            if(response.status===200){
                console.log("courses list response ",response.data);
                this.setState({ dataToShow:response.data });
            }else {

            }
        });
    }

    registerforcourse(course){
        return ServerService.postToServer('courses/newRegistration',
            {
                token:getToken(),
                course:course

            }).then((response)=>{
            if(response.status=== 200){
                console.log('Response',response);
                setToken(response.data);
                return (true);
            }else {
                return false;
            }
        });
    }

    cancelregistration(course){
        return ServerService.postToServer('courses/cancelRegistration',
            {
                token:getToken(),
                course:course
            }).then((response)=>{
                if(response.status===200){
                    console.log('Response',response);
                    setToken(response.data);
                    return (true);
                }else {
                    return false;
                }
            });
    }

    handleClick(course){
        this.props.openCourse(course);
    }
     showInscriptionOptions(course){
       if(this.props.loggedIn){
            return(
                <div className={"tooltip-content"} onClick={e=>e.stopPropagation()}>
                    <RegisterForCourse
                        course={course}
                        newregistration={()=>this.registerforcourse(course)}
                        cancelregistration={()=>this.cancelregistration(course)}                                                         register={()=>this.register(course)
                    }
                    />
                </div>
            );
       }
    }

    render(){
        return(
            <div>
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
                                    {this.showInscriptionOptions(course)}
                                </div>
                            );
                        })
                    }
                </div>
            </div>
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
        console.log(this.props);
        this.props.history.push('/course/'+course._id);
    }
    render() {
        return (
            <React.Fragment>
                <CoursesHeader/>
                <CoursesList
                    openCourse = {(course)=>this.handleOpenCourse(course)}
                    loggedIn = {this.props.loggedIn}
                />
                <CoursesFooter/>
            </React.Fragment>
        );
    }
}

export default Courses;

