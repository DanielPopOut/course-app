import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import './courses.css';

import CourseSection from "../CourseSectionComponent/CourseSection";
import CourseSelection from "../CourseSelectionComponent/CourseSelectionComponent";
import AddAdminCourse from "../AddAdminCourseComponent/AddAdminCourse";
import NewCourseView from '../NewCourseComponent/NewCourse';


function Courses(props) {
    let baseURL = '/courses/';
    return (
        <div >
            <h2> Courses Options </h2>
            <div className='coursemenu'>
                <ul>
                    <li>
                        <Link to={'/courses/newcourse'}> New Course</Link>
                    </li>
                    <li>
                        <Link to={'/courses/section'}> Section</Link>
                    </li>
                    <li>
                        <Link to={'/courses/selection'}> Selection</Link>
                    </li>
                    <li>
                        <Link to={'/courses/admin'}> Admin</Link>
                    </li>
                </ul>
            </div>
            <div>
                <Route path={baseURL + 'newcourse'} component={NewCourseView}/>
                <Route path={baseURL + 'section'} component={CourseSection}/>
                <Route path={baseURL + 'selection'} component={CourseSelection}/>
                <Route path={baseURL + 'admin'} component={AddAdminCourse}/>
            </div>
        </div>
    );
}

export default Courses;

