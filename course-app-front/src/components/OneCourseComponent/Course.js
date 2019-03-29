import React, {Component} from 'react';
import './course.css';
import {ButtonHelper} from "../HelperComponent/FormHelper";
import NewTeacher from "./NewTeacher";
import {ServerService} from "../../server/ServerService";
import ReactQuill, {} from 'react-quill';
import MCQsComponent from "../MCQsComponent/MCQsComponent";
import TestComponent from "../MCQsComponent/TestComponent";

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
                <div className={'title-div'}>
                    <h1>{displayContent(element.title, level)}</h1>
                   {/* <div className={'new-mcq-option'}>
                        <MCQsComponent course_level={level} reference={element_id}/>
                        <TestComponent course_level={level} reference={element_id}/>
                    </div>*/}
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
        }
    }

    componentWillMount() {
        ServerService.postToServer('courses/getCourse', {course_id: this.props.match.params.id})
            .then((response) => {
                if (response.status === 200) {
                    console.log("course to display result ", response);
                    let course=response.data;
                    if(course.hasOwnProperty('chapters') && course['chapters'].length>0){
                        ServerService.postToServer('courses/getCourseElements',{
                            elements_ids:course['chapters'],
                            elements_collection:'chapters'
                        }).then((response)=>{
                            if(response.status===200){
                                console.log("getting chapters done!!",response.data);
                                course['chapters']=response.data;
                                this.setState({
                                    courseToDisplay: course,
                                    ready:true
                                });
                            }else {
                                console.log("Error while getting chapters!!",response.data.errorMessage);
                            }
                        });
                    }
                    this.setState({
                            courseToDisplay: course,
                            ready:true
                        });
                } else {
                    this.setState({
                        courseToDisplay: fakeCourse,
                        ready:true
                    });
                }
            });
    }

    displayCourse(){
        //make sure the course has been loaded already
        if(this.state.ready){
            return displayElement(this.state.courseToDisplay);
        }else{
            return<div style={{textAlign:'center'}}><img src={'/images/al.gif'}/></div>
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className={"course-options"}>
                    <NewTeacher course={this.state.courseToDisplay}/>
                </div>
                <div className={'course-content-div'}>
                    <div>
                        {this.displayCourse()}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Course;