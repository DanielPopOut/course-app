import React, {Component} from 'react';
import './course.css';
import {ButtonHelper} from "../HelperComponent/FormHelper";
import NewTeacher from "./NewTeacher";
import {ServerService} from "../../server/ServerService";
import ReactQuill, {} from 'react-quill';
import MCQsComponent from "../MCQsComponent/MCQsComponent";
import TestComponent from "../MCQsComponent/TestComponent";

const fakeCourse = {
    title: "No Content Available",
    description: "",
    content: ""
};
let lowerLevelCollectionName = {
    courses: 'chapters',
    chapters: 'sections',
    sections: 'subsections'
};

class Course extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseToDisplay: {}
        }
    }

    componentDidMount() {
        ServerService.postToServer('courses/getCourse', {_id: this.props.match.params.id})
            .then((response) => {
                if (response.status === 200) {
                    console.log("course to display result ", response);
                    this.setState({courseToDisplay: response.data});
                } else {
                    this.setState({
                        courseToDisplay: fakeCourse
                    });
                }
            });
    }

    displayContent(content) {
        return (<ReactQuill value={content || ""} modules={{toolbar: false}} readOnly={true}/>);
    }

    displayElement(element, level = 'courses') {
        if (element) {
            let element_id=element._id||element;
            console.log("the element ",element, "and the id ",element_id);
            return (
                <React.Fragment>
                    <div className={'title-div'}>
                        <div className={'new-mcq-option'}>
                            <MCQsComponent course_level={level} reference={element_id}/>
                        </div>

                        <h1>{this.displayContent(element.title,level)}</h1>
                    </div>

                    <div className={'content-div'}>
                        {this.displayContent(element.content)}
                    </div>
                    <div className={"sub-element-content"}>
                        {this.displaySubElements(element, level)}
                    </div>
                </React.Fragment>
            )
        }
    }

    displaySubElements(element, level) {
        if (element.hasOwnProperty(lowerLevelCollectionName[level]) && element[lowerLevelCollectionName[level]].length > 0) {
            let result = element[lowerLevelCollectionName[level]].map((subElement, key) => {
                return (
                    <React.Fragment key={key}>
                        {this.displayElement(subElement, lowerLevelCollectionName[level])}
                    </React.Fragment>
                );
            });
            return (result);
        } else {
            return "";
        }
    }

    openCourseCreationMode(){
        let course=this.state.courseToDisplay;
        this.props.history.push('/coursecreationmode/'+course._id);
    }
    render() {
        return (
            <React.Fragment>
                <div className={"course-options"}>
                    <NewTeacher course={this.state.courseToDisplay}/>

                    <TestComponent reference={this.state.courseToDisplay._id}/>
                </div>
                <div className={'course-content-div'}>
                    {this.displayElement(this.state.courseToDisplay, 'courses')}
                </div>
            </React.Fragment>
        )
    }
}

export default Course;