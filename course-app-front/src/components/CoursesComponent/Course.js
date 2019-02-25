import React, {Component} from 'react';
import './course.css';
import {ButtonHelper} from "../HelperComponent/FormHelper";
import NewTeacher from "./NewTeacher";
import {ServerService} from "../../server/ServerService";
import ReactQuill, {} from 'react-quill';

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
            return (
                <React.Fragment>
                    <div className={'title-div'}>
                        {this.displayContent(element.title)}
                    </div>

                    <div className={'content-div'}>
                        {this.displayContent(element.content)}
                    </div>
                    <div className={"sub-element-content"}>
                        {this.displaySubElements(element, level)}
                    </div>
                </React.Fragment>
            )
        } else {
            return ("");
        }

    }

    displaySubElements(element, level) {
        if (element.hasOwnProperty(lowerLevelCollectionName[level]) && element[lowerLevelCollectionName[level]].length > 0) {
            console.log("children", element[lowerLevelCollectionName[level]]);
            let result = element[lowerLevelCollectionName[level]].map((subElement, key) => {
                console.log("child exist", subElement);
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

    render() {
        return (
            <React.Fragment>
                <div style={{textAlign: 'right'}}>
                    <NewTeacher course={this.state.courseToDisplay}/>
                </div>
                <div className={'course-content-div'}>
                    {this.displayElement(this.state.courseToDisplay, 'courses')}
                </div>
            </React.Fragment>
        )
    }
}

export default Course;