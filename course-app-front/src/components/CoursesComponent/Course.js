import React,{Component} from 'react';
import './course.css';
import {ButtonHelper} from "../HelperComponent/FormHelper";
import NewTeacher from "./NewTeacher";
import {ServerService} from "../../server/ServerService";
import ReactQuill,{} from 'react-quill';

const modules = {
    toolbar: false,
};
const fakeCourse = {
    title:"No Content Available",
    description:"",
    content:""
};

class Course extends Component{
    constructor(props){
        super(props);
        this.state={
            courseToDisplay:{}
        }
    }
    componentDidMount(){
        ServerService.postToServer('courses/getCourse',{_id:this.props.match.params.id})
            .then((response)=>{
                if(response.status===200){
                    console.log("course to display result ",response);
                    this.setState({courseToDisplay:response.data});
                }else {
                    this.setState({
                        courseToDisplay:fakeCourse
                    });
                }
            });
    }
    displayContent(content){
        return(
            <ReactQuill value={content||""}
                        modules={modules}
                        readOnly={true}

            />
        )
    }
    displayCourse(course){
        return(
            <React.Fragment>
                <div>
                    {this.displayContent(course.title)}
                </div>
                <div>
                    {this.displayContent(course.content)}
                </div>
            </React.Fragment>
        );
    }
    render() {
        return (
            <React.Fragment>
                <div style={{textAlign:'right'}}>
                    <NewTeacher course={this.state.courseToDisplay}/>
                </div>
                <div className={'course-content-div'}>
                    {this.displayCourse(this.state.courseToDisplay)}
                </div>
            </React.Fragment>
        )
    }
}

export default Course;