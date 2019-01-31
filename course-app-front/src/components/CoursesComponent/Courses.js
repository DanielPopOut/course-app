import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import './courses.css';

import NewCourse from "../NewCourseComponent/NewCourse";
import CourseSection from "../CourseSectionComponent/CourseSection";
import CourseSelection from "../CourseSelectionComponent/CourseSelectionComponent";
import AddAdminCourse from "../AddAdminCourseComponent/AddAdminCourse";
import DataManagerComponent from "../DataManagerComponent/DataManagerComponent";
import {coursesModel} from "../DataManagerComponent/DataModelsComponent";
import DataManagerPage from "../DanielComponent/DataManagerPage/DataManagerPage";
// import { browserHistory } from 'react-router'



class CoursesHeader extends Component{
    render(){
        return(
            <div>




            </div>
        );
    }

}


class CoursesList extends Component{
    constructor(props){
        super(props);
        this.state={
            dataToShow:this.props.dataToShow||[],
        }
    }

    render(){
        return("");
    }
}
class Courses extends Component {
    render() {
        let baseURL = '/courses/daniel/';
        console.log('course props',this.props);
        return (
            <div>
                <DataManagerPage {...coursesModel}/>
                <button onClick={()=>this.props.history.push('daniel')}>Go to success</button>
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
export default Courses;

