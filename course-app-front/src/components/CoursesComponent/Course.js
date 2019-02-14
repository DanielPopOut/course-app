import React,{Component} from 'react';
import './course.css';
import {ButtonHelper} from "../HelperComponent/FormHelper";
import NewTeacher from "./NewTeacher";
import {ServerService} from "../../server/ServerService";

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

    //retrieveCourseToDisplay(){}

    render() {
        return (
            <div>
                <div style={{textAlign:'right'}}>
                    <NewTeacher course={this.state.courseToDisplay}/>
                </div>
                <h2>
                    {this.state.courseToDisplay.title}
                    </h2>
                <div>
                    {this.state.courseToDisplay.description}
                    </div>
                <div className={'course-content-div'}>
                    <div style={{textAlign:'right'}}>
                        <ButtonHelper
                            {...{
                                name: 'newsection',
                                value: 'New Section',
                                className: 'form-helper-button success'
                            }} onClick={() => {
                        }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Course;