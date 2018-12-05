import React, { Component } from 'react';
import './newcourse.css';

const subjects=[
    {
        title:"Mathematics",
        description:" A simple description ",
        subsubject:[
            {title:"Algebre",description:" A simple description "},
            {title:"Analyse",description:" A simple description "},
            {title:"Geometrie",description:" A simple description "},
        ]
    },
    {
        title:"Physics",
        description:" A simple description ",
        subsubject:[
            {title:"Les Lois de Newton",description:" A simple description "},
            {title:"Physique quantique",description:" A simple description "},
        ]
    },

];


class Title extends Component{
    render(){
        return(
            <div className="newcourse-input-title">
                <label> Title</label>
                <input type="text" name="title"/>
            </div>
        );
    }
}

class Subject extends Component{
    constructor(props){
        super(props);
        this.state={
            subjectsList: subjects.map(function(sub){return sub.title}),
            subSubjectList:[]
        };
        this.handleChange=this.handleChange.bind(this);
    }

    handleChange(e){
        console.log(subjects.find(subject=>subject.title===e.target.value).subsubject);
        this.setState({subSubjectList: subjects.find(subject=>subject.title===e.target.value).subsubject });
    }
    render(){
        return(
            <div>
                <label> Module</label>
                <select name="subjectselection" onChange={e =>this.handleChange(e)}>
                    {this.state.subjectsList.map(function (sub) {
                        return (<option value={sub} > {sub} </option>);}
                        )
                    }
                </select>

                <label> Sub Module</label>
                <select name="subsubjectselection">
                    {this.state.subSubjectList.map(function (sub) {
                        return (<option value={sub.title} > {sub.title} </option>);}
                    )
                    }

                </select>
            </div>
        );
    }
}



class NewCourseFormButtons extends Component{
    render(){
        return(
            <div>
                <input type="submit" value="Valider"/>
                <input type="reset" value="Annuler"/>
            </div>
        );
    }
}
class NewCourseForm extends Component{
    render(){
        return(
            <form name="newcourseform">
                <Title/>
                <Subject/>
                <NewCourseFormButtons/>
            </form>
        )
    }
}
class NewCourse extends Component{
    render(){
        return(
            <div>
                <NewCourseForm/>
            </div>
        );
    }
}
export default NewCourse;
