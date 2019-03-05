import React,{Component} from 'react';
import './coursenavigator.css';

let lowerCourseLevel={
    courses:'chapters',
    chapters:'sections',
    sections:'subsections'
};

let waitingElement=[{
    title:<img src={"images/al.gif"}/>
}];








class CourseNavigator extends Component{
    constructor(props){
        super(props);
        this.state={
            courses:[],
            selectedElement:{},
            selectedElementType:""
        }
    }
    render(){
        return(
            <div>

            </div>
        );
    }
}