import React, {Component} from 'react';
import './courses.css';

import {ButtonHelper, InputTextHelper} from "../HelperComponent/FormHelper";
import RegisterForCourse from "./RegisterForCourse";
import {getToken,setToken} from '../../server/axiosInstance';
import {ServerService} from "../../server/ServerService";


class CoursesHeader extends Component{
    constructor(props){
        super(props);
        this.state={searchedElement:""}
    }

    handleChange(e){
        this.setState({ searchedElement:e.target.value });
        console.log("search params ",this.state);
        if(e.target.value===""){
            this.props.handleValidateSearch(this.state.searchedElement);
        }

    }

    handleKeyPressOnSearch(event){
        if(event.key==="Enter"){
            this.props.handleValidateSearch(this.state.searchedElement);
        }
        console.log("after state ",this.state);
    }

    render(){

        let buttonnewcourse={
            name:"newuserbutton",
            value:"Ajouter un cours",
            className:"form-helper-button success",
            onClick:()=>{this.props.handleRedirection('/createcourse')}
        };
        let inputsearchparams={
            type:'text',
            name : 'input-course-search',
            className : "search-input form-helper-input ",
            placeholder :'Course Title',
            autoFocus:true
        };

        return(
            <React.Fragment>
                <div className={"courses-search-new-div"}>
                    <div className={"div-search-block  "}
                         onKeyPress={(event)=>{this.handleKeyPressOnSearch(event)}}
                    >
                        <InputTextHelper {...inputsearchparams} onChange={(e)=>this.handleChange(e)} />

                        <div className={"div-img-search"}>
                            <img src={"/images/search.png"}
                                 alt={"Search"}
                                 onClick={()=>this.props.handleValidateSearch(this.state.searchedElement)}
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

export class CoursesList extends Component{

    newregistration(course){
        return  ServerService.postToServer('courses/newRegistration',
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
                        newregistration={async ()=> await this.newregistration(course)}
                        cancelregistration={async ()=> await this.cancelregistration(course)}                                                         register={()=>this.register(course)
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
                        this.props.courses.map((course,key)=>{
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

export class CoursesListByDepartment extends Component{

    newregistration(course){
        return  ServerService.postToServer('courses/newRegistration',
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

    handleClick(course){this.props.openCourse(course);}

     showInscriptionOptions(course){
       if(this.props.loggedIn){
            return(
                <div className={"tooltip-content"} onClick={e=>e.stopPropagation()}>
                    <RegisterForCourse
                        course={course}
                        newregistration={async ()=> await this.newregistration(course)}
                        cancelregistration={async ()=> await this.cancelregistration(course)}                                                         register={()=>this.register(course)
                    }
                    />
                </div>
            );
       }
    }

    displayCourses(){
        return(
            this.props.courses.map((department,key)=>{
                return(
                    <div key={key} className={"department-level-div"}>
                        <h5 className={"department-title"}> {department.department.label}</h5>
                        <div className={"department-courses-div"}>
                            {
                                department.specialities.map((speciality,key)=>{
                                    return(
                                        <div key={key}>
                                            <h5 className={"speciality-title"}> {speciality.speciality.label}</h5>
                                            <div className={"speciality-content-div"}>
                                                {
                                                    speciality.courses.map((course,key)=>{
                                                        return(
                                                            <div key={key} onClick={(e)=>this.handleClick(course)} className={"course-title"}>
                                                                {course.title}
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                );
            })
        );
    }

    render(){
        return(
            <div>
                <div className={'courses-list-div'}>
                    {
                        this.displayCourses()
                    }
                </div>
            </div>
        );
    }
}

class Courses extends Component {

    constructor(props){
        super(props);
        this.state={
            courses:[]
        }
    }

    componentDidMount(){
        ServerService.getFromServer('courses/getCoursesByDepartment').then((response)=>{
            if(response.status===200){
                console.log("courses list response ",response.data);
                this.setState({courses:response.data });
            }
        });
    }

    handleRedirection(url){
        this.props.history.push(url);
    }

    handleOpenCourse(course){
        console.log(this.props);
        this.props.history.push('/course/'+course._id);
    }

    handleValidateSearch(data){
        console.log("data sended ",data);
        if(!data){
            this.componentDidMount();
        }else {
            ServerService.postToServer('/courses/findCoursesFromTitle', {title:data}).then((response) => {
                if(response.status===200){
                    console.log("find results ",response.data);
                    this.setState({courses:response.data});
                }else {
                    console.log('find error ',response.data.errorMessage);
                }
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <CoursesHeader
                    handleRedirection={(url)=>this.handleRedirection(url)}
                    handleValidateSearch={(data)=>this.handleValidateSearch(data)}
                />
                <CoursesListByDepartment
                    courses={this.state.courses}
                    openCourse = {(course)=>this.handleOpenCourse(course)}
                    loggedIn = {this.props.loggedIn}
                />
            </React.Fragment>
        );
    }
}

export default Courses;

