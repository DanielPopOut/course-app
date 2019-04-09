import React,{Component} from "react";
import "./coursesadministration.css";

class Departments extends Component{
    constructor(props){
        super(props);
        this.state={
            id:"",
            name:"",
            responsable:"",
            user_in_charge:"",
            specialities:[],
            mode:"creation"
        }
    }

    save(){

    }

    render(){
        return(
            <div>
                <h2>Departments</h2>


            </div>
        )
    }
}

class Specialities extends Component{
    constructor(props){
        super(props);

    }
    render(){
        return(
            <div>

            </div>
        )
    }

}

class Levels extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <div>
               
            </div>
        );
    }

}

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


