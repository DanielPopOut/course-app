import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import './courses.css';

import NewCourse from "../NewCourseComponent/NewCourse";
import CourseSection from "../CourseSectionComponent/CourseSection";
import CourseSelection from "../CourseSelectionComponent/CourseSelectionComponent";
import AddAdminCourse from "../AddAdminCourseComponent/AddAdminCourse";


function Courses(props) {
    let baseURL = '/courses/';
    return (
        <div>
            <h2> Courses Options </h2>
            <div className='coursemenu'>
                <ul>
                    <li>
                        <Link to={baseURL +'newcourse'}> New Course</Link>
                    </li>
                    <li>
                        <Link to={baseURL +'section'}> Section</Link>
                    </li>
                        <li>
                        <Link to={baseURL +'selection'}> Selection</Link>
                    </li>
                    <li>
                        <Link to={baseURL +'admin'}> Admin</Link>
                    </li>
                </ul>
            </div>
            <div>
                <Route path={baseURL +'newcourse'} component={NewCourse}/>
                <Route path={baseURL + 'section'} component={CourseSection}/>
                <Route path={baseURL + 'selection'} component={CourseSelection}/>
                <Route path={baseURL + 'admin'} component={AddAdminCourse}/>
            </div>
        </div>
    );
}

export default Courses;

