import React, { Component } from 'react';
import './newcourse.css';
import { ServerService } from '../../server/ServerService';
import { COURSE_PATH } from '../../server/SERVER_CONST';

const subjects = [
    {
        title: 'Mathematics',
        description: ' A simple description ',
        subsubject: [
            {title: 'Algebre', description: ' A simple description '},
            {title: 'Analyse', description: ' A simple description '},
            {title: 'Geometrie', description: ' A simple description '},
        ],
    },
    {
        title: 'Physics',
        description: ' A simple description ',
        subsubject: [
            {title: 'Les Lois de Newton', description: ' A simple description '},
            {title: 'Physique quantique', description: ' A simple description '},
        ],
    },

];

class Subject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subjectsList: subjects.map(function (sub) {
                return sub.title;
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
            subSubjectList: subjects.find(subject => subject.title === e.target.value).subsubject,
        });
        this.props.onChange('module', e.target.value);

    }

    handleSubSubjectChange(e) {
        this.setState({
            subSubjectSelected: e.target.value,
        });
        this.props.onChange('submodule', e.target.value);
    }

    render() {
        return (
            <div>
                <div className='label-input-div'>
                    <label> Module</label>
                    <select name="subjectselection" onChange={e => this.handleSubjectChange(e)}>
                        {this.state.subjectsList.map(function (sub) {
                                return (<option value={sub}> {sub} </option>);
                            },
                        )
                        }
                    </select>
                </div>

                <div className='label-input-div'>
                    <label> Sub Module</label>
                    <select name="subsubjectselection" onChange={e => this.handleSubSubjectChange(e)}>
                        {this.state.subSubjectList.map(function (sub) {
                                return (<option value={sub.title}> {sub.title} </option>);
                            },
                        )
                        }

                    </select>
                </div>
            </div>
        );
    }
}


class NewCourse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataToSend: {
                title: 'wwmigo',
                module: '',
                submodule: 'BUOBOUB',
                description: '',
            },
            moduleList: subjects.map(function (sub) {
                return sub.title;
            }),
            subModuleList: [],
        };
    }

    changeData(e) {
        this.setState({
            dataToSend: Object.assign({},this.state.dataToSend, {[e.target.name]: e.target.value })
        });
        if (e.target.name === 'module') {
            this.setState({
                subModuleList: subjects.find(subject => subject.title === e.target.value).subsubject,
            });
        }
    }

    sendNewCourse() {
        ServerService.postToServer(COURSE_PATH, this.state.dataToSend).then(response => console.log(response, response.data))
    }
    getAllCourses() {
        ServerService.getFromServer(COURSE_PATH).then(response => console.log(response, response.data))
    }



    render() {
        return (
            <div className="container margin-auto">
                <h2>Creer nouveau cours</h2>

                <div className='label-input-div'>
                    <label> Module</label>
                    <select name="module" onChange={e => this.changeData(e)}>
                        {this.state.moduleList.map(sub => <option value={sub}> {sub} </option>)}
                    </select>
                </div>

                <div className='label-input-div'>
                    <label> Sub Module</label>
                    <select name="submodule" value={this.state.dataToSend.submodule} onChange={e => this.changeData(e)}>
                        {this.state.subModuleList.map(sub => <option value={sub.title}> {sub.title} </option>)}
                    </select>
                </div>

                <div className="label-input-div">
                    <label> Title</label>
                    <input type="text" name="title"
                           value={this.state.dataToSend.title}
                           onChange={e => this.changeData(e)}/>
                </div>

                <div className="label-input-div">
                    <label> Description</label>
                    <input type="text" name="description"
                           value={this.state.dataToSend.description}
                           onChange={e => this.changeData(e)}/>
                </div>

                <div>
                    <button type="submit" value="Valider" onClick={() => this.sendNewCourse()}> Valider</button>
                    <input type="reset" value="Annuler"/>
                    <button type="submit" value="Valider" onClick={() => this.getAllCourses()}> Recuperer cours</button>

                </div>

                <div>{this.state.module + this.state.submodule + this.state.title}</div>
            </div>
        );
    }

}

export default NewCourse;
