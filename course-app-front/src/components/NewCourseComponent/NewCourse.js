import React, {Component} from 'react';
import './newcourse.css';

const subjects = [
    {
        title: "Mathematics",
        description: " A simple description ",
        subsubject: [
            {title: "Algebre", description: " A simple description "},
            {title: "Analyse", description: " A simple description "},
            {title: "Geometrie", description: " A simple description "},
        ]
    },
    {
        title: "Physics",
        description: " A simple description ",
        subsubject: [
            {title: "Les Lois de Newton", description: " A simple description "},
            {title: "Physique quantique", description: " A simple description "},
        ]
    },

];

class Subject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subjectsList: subjects.map(function (sub) {
                return sub.title
            }),
            subSubjectList: [],
            subjectSelected: '',
            subSubjectSelected: '',
        };
    }

    handleSubjectChange(e) {
        console.log(subjects.find(subject => subject.title === e.target.value).subsubject);
        this.setState({
            subjectSelected: e.target.value,
            subSubjectList: subjects.find(subject => subject.title === e.target.value).subsubject
        });
        this.props.onChange('module', e.target.value)

    }

    handleSubSubjectChange(e) {
        this.setState({
            subSubjectSelected: e.target.value,
        });
        this.props.onChange('submodule', e.target.value)
    }

    render() {
        return (
            <div>
                <label> Module</label>
                <select name="subjectselection" onChange={e => this.handleSubjectChange(e)}>
                    {this.state.subjectsList.map(function (sub) {
                            return (<option value={sub}> {sub} </option>);
                        }
                    )
                    }
                </select>

                <label> Sub Module</label>
                <select name="subsubjectselection" onChange={e => this.handleSubSubjectChange(e)}>
                    {this.state.subSubjectList.map(function (sub) {
                            return (<option value={sub.title}> {sub.title} </option>);
                        }
                    )
                    }

                </select>
            </div>
        );
    }
}


class NewCourse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'wwmigo',
            module: '',
            submodule: '',
        };
    }

    render() {
        return (
            <form name="newcourseform">
                <div className="newcourse-input-title">
                    <label> Title</label>
                    <input type="text" name="title"
                           value={this.state.title}
                           onChange={(e) => this.setState({title: e.target.value})}/>
                </div>
                <Subject onChange={(keyToModify, value)=>{this.setState({[keyToModify]: value})}}/>
                <div>
                    <button type="submit" value="Valider" onClick={()=> alert(JSON.stringify(this.state))}> Valider </button>
                    <input type="reset" value="Annuler"/>
                </div>
                <div>{this.state.module + this.state.submodule + this.state.title}</div>
            </form>
        )
    }
}

export default NewCourse;
