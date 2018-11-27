import React, { Component } from 'react';
import './CourseSelectionComponent.css';

let fakeCourseList = [
    {
        id: 123141,
        title: 'integration',
        area: 'maths',
        subArea: 'integration',
        level: 9,
        description: 'Discover the meaning and usefulness of integration',
    },
    {id: 123142, title: 'period and length', area: 'physics', subArea: 'waves', level: 6},
    {id: 123143, title: 'atoms and electrons', area: 'physics', subArea: 'atoms', level: 7},
];

let areas = ['maths', 'physics', 'chemistry'];
let subareas = {
    maths: ['integration', 'else'],
    physics: ['electricity', 'waves'],
    chemistry: ['atoms',],
};
let grades = [6, 7, 8, 9, 10, 11, 12];


export default class CourseSelectionComponent extends Component {
    tableauNavbar = [
        {title: 'AlphaM', redirectionAddress: '/welcome'},
        {title: 'Cours', redirectionAddress: '/courses'},
        {title: 'Contacts', redirectionAddress: '/contacts'},
        {title: 'Connexion', redirectionAddress: '/connexion'},
    ];

    constructor(props) {
        super(props);
        this.state = {
            redirectionAddress: '',
            gradesToShow: grades,
            areasToShow: areas,
        };
    }

    render() {
        return <div>
            <LineSelector selectionPossibilities={areas} value='areas'
                          onChange={(newAreasToShow) => this.setState({areasToShow: newAreasToShow})}/>
            <LineSelector selectionPossibilities={grades} value='grades'
                          onChange={(newGradesToShow) => this.setState({gradesToShow: newGradesToShow})}/>
            {fakeCourseList
                .filter(course => this.state.gradesToShow.indexOf(course.level) > -1 && this.state.areasToShow.indexOf(course.area) > -1)
                .map(course => <CourseLayout course={course}/>)
            }
        </div>;
    }
}

class LineSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectionPossibilities: props.selectionPossibilities,
            selected: props.selectionPossibilities,
        };
    }

    setSelected(valueToSetSelected, allValue = -1) {
        let selectedDuplicate = Object.assign([], this.state.selected);
        if (allValue > -1) { //click on all or none --> special action
            selectedDuplicate = allValue > 0 ? this.props.selectionPossibilities : [];
        } else { // click on a value --> add the value or remove it if already added
            let indexInSelectedTable = this.state.selected.indexOf(valueToSetSelected);
            if (indexInSelectedTable > -1) {
                selectedDuplicate.splice(indexInSelectedTable, 1);
            } else {
                selectedDuplicate.push(valueToSetSelected);
            }
            console.log(selectedDuplicate);
        }
        this.setState({selected: selectedDuplicate});
        this.props.onChange(selectedDuplicate);
    }

    isValueToShowSelected(valueToShow) {
        return this.state.selected.indexOf(valueToShow) > -1;
    }

    render() {
        return <div className='inline-selection-container'>
            <div className='actions-div'>
                <span>{this.props.value}</span>
                <span>
                    <button onClick={() => this.setSelected('', 1)}>All</button>
                    <button onClick={() => this.setSelected('', 0)}>None</button>
                </span>
            </div>
            <div className='choices-div'>{
                this.state.selectionPossibilities.map(
                    elementClicked => <span className={this.isValueToShowSelected(elementClicked) ? 'selected' : ''}
                                            onClick={() => this.setSelected(elementClicked)}>{elementClicked}</span>)
            }</div>
        </div>;
    }
}


function CourseLayout(props) {
    let courseData = props.course;
    return <div className='course-layout'>
        <div><span>{courseData.area + ' | ' + courseData.subArea}</span> <span>{'level ' + courseData.level}</span>
        </div>
        <span>{courseData.title}</span>
        <span>{courseData.description}</span>
    </div>;
}
