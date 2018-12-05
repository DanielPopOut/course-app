import React,{Component} from 'react';
import {Route,Link} from 'react-router-dom';
import './courses.css';

import NewCourse from "../NewCourseComponent/NewCourse";
import CourseSection from "../CourseSectionComponent/CourseSection";
import CourseSelection from "../CourseSelectionComponent/CourseSelectionComponent";
import AddAdminCourse from "../AddAdminCourseComponent/AddAdminCourse";


function  Courses({match}) {
    return(
        <div>
            <h2> Courses Options </h2>
            <div className='coursemenu'>
                <ul>
                    <li>
                        <Link to={`${match.url}/newcourse`}> New Course</Link>
                    </li>
                    <li>
                        <Link to={`${match.url}/section`}> Section</Link>
                    </li>
                    <li>
                        <Link to={`${match.url}/selection`}> Selection</Link>
                    </li>
                    <li>
                        <Link to={`${match.url}/admin`}> Admin</Link>
                    </li>
                </ul>
            </div>
            <div>
                <Route path = {`${match.url}/newcourse`} component={NewCourse}/>
                <Route path = {`${match.url}/section`} component = {CourseSection}/>
                <Route path = {`${match.url}/selection`} component = {CourseSelection}/>
                <Route path = {`${match.url}/admin`} component = {AddAdminCourse}/>
            </div>
        </div>
    );
}

export default Courses;

