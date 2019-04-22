import React, {Component} from 'react';
import './course.css';
import {ButtonHelper} from "../HelperComponent/FormHelper";
import NewTeacher from "./NewTeacher";
import {ServerService} from "../../server/ServerService";
import ReactQuill, {} from 'react-quill';

import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import CourseCreation from "../CoursesComponent/CourseCreation";
import NavCourse from "./NavCourse";

const fakeCourse = {
    title: "",
    content: "<p> Sorry this course is not availaible !!</p>"
};

let lowerLevelCollectionName = {
    courses: 'chapters',
    chapters: 'sections',
    sections: 'subsections'
};

export function displayElement(element, level = 'courses') {
    if (element && (element.content||element.title)) {
        let element_id=element._id || element;
        //console.log("the element:",element_id," level ",level," the id ",element_id);
        return (
            <React.Fragment>
                <div className={'title-div'} id={element_id}>
                    <h2>{element.title}</h2>
                </div>

                <div className={'content-div'}>
                    {displayContent(element.content)}
                </div>
                <div className={"sub-element-content"}>
                    {displaySubElements(element, level)}
                </div>
            </React.Fragment>
        );
    }
}

export function displaySubElements(element, level) {
    if (element.hasOwnProperty(lowerLevelCollectionName[level]) && element[lowerLevelCollectionName[level]].length > 0) {
        let result = element[lowerLevelCollectionName[level]].map((subElement, key) => {
            return (
                <React.Fragment key={key}>
                    {displayElement(subElement, lowerLevelCollectionName[level])}
                </React.Fragment>
            );
        });
        return (result);
    } else {
        return "";
    }
}

function displayContent(content) {
    return (<ReactQuill value={content || ""} modules={{toolbar: false}}  readOnly={true}/>);
}



class Course extends Component {

    constructor(props) {
        super(props);
        this.state = {
            courseToDisplay: {},
            ready:false,
            modalChildren:"",
            modalVisibility:false,
        }
    }

    componentWillMount() {
         ServerService.postToServer("/courses/getHoleCourse", {course: this.props.match.params.id}).then((response) => {
             if (response.status === 200) {
                 console.log("hole course result", response.data);
                 this.setState({
                     courseToDisplay: response.data,
                     ready:true
                 });
             } else {
                 this.setState({
                     courseToDisplay: fakeCourse,
                     ready:true
                 });
                 console.log("Error getting hole course", response.data['errorMessage']);
             }
         });
    }

    displayCourse(){
        if(this.state.ready){
            return displayElement(this.state.courseToDisplay,"courses",this.addRef);

        }else{
            return<div style={{textAlign:'center'}}><img alt="" src={'/images/al.gif'}/></div>
        }
    }


    openModal(content){
        this.setState({
            modalChildren:content,
            modalVisibility:true
        });
    }

    closeModal(){
        this.setState({
            modalChildren:"",
            modalVisibility:false
        });
    }

    modifyCourse(){
        let content=<CourseCreation course={this.state.courseToDisplay} mode="update"/>;
        this.openModal(content);
    }
    deleteCourse(){
        let dataToSend={
          collection:"courses",
          data:this.state.courseToDisplay
        };
        ServerService.postToServer("/crudOperations/delete",dataToSend).then(response=>{
           if(response.status===200){
               console.log("deletion result ",response);
               alert("Course Delete !!");
           }else {
               console.log("deletion error ",response.data.errorMessage||response);
               alert("deletion error");
           }
        });
    }
    displayOptions(){
        if(this.state.ready){
            return(
                <React.Fragment>
                    <NewTeacher course={this.state.courseToDisplay}/>
                    <ButtonHelper {...{
                        name:"modifycoursebutton",
                        value:"Modify Course",
                        className:"form-helper-button success"
                    }} onClick={()=>this.modifyCourse()}
                    />
                    <ButtonHelper {...{
                        name:"deletecourse",
                        value:"Delete Course",
                        className:"form-helper-button danger"
                    }} onClick={()=>this.deleteCourse()}
                    />
                </React.Fragment>
            );
        }
        return"";
    }

    render() {
        return (
            <React.Fragment>
                <NavCourse course={this.state.courseToDisplay}/>

                <ModalComponent visible={this.state.modalVisibility}
                                onClose={()=>this.closeModal()}>
                    {this.state.modalChildren}
                </ModalComponent>
                <div className={"hr-button-block course-options"}>
                    { this.displayOptions()}
                </div>
                <div className={'course-content-div'}>
                    <div>{this.displayCourse()}</div>
                </div>
            </React.Fragment>
        )
    }
}

export default Course;