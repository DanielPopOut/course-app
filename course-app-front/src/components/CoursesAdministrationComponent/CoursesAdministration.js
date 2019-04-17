import React,{Component} from "react";
import "./coursesadministration.css";
import Departments from "./Departments";


class CoursesAdministration extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <div className={"courses-administration-main-div"}>
                <div> <h3>Courses Administration</h3></div>
                <Departments/>
            </div>
        );
    }
}

export default CoursesAdministration;


