import React,{Component} from "react";
import "./coursesadministration.css";
import Levels from "./Levels";
import Specialities from "./Specialities";
import Departments from "./Departments";


class CoursesAdministration extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <div>
                <h2>Courses Administration</h2>
                <Departments/>
                <Specialities/>
                <Levels/>

            </div>
        );
    }
}

export default CoursesAdministration;


