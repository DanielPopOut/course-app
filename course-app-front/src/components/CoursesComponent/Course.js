import React,{Component} from 'react';
import './course.css';
import {ButtonHelper} from "../HelperComponent/FormHelper";

const courseslist = [
    {
        '_id':1,
        title:"course title 1 ",
        description: "description description" +
        " description description description " +
        "description "
    },
    {
        '_id':2,
        title:"course title 2",
        description: "description description" +
        " description description description description" +
        " description description ar8gpgipi description description description " +
        "description "
    },
    {
        '_id':3,
        title:"course title 3",
        description: "description description" +
        " description description description description" +
        " description description ar8gpgipi description description description " +
        "description "
    }, {
        '_id':4,
        title:"course titlecourse 4 titlecourse 4 title verugfery goygworgo 8g7o348 qo48gq 74go34879goq84g87g847goq4 87gq",
        description: "description description" +
        " description description description description" +
        " description description ar8gpgipi description description description " +
        "description "
    },
    {
        '_id':5,
        title:"course title 5",
        description: "description description" +
        " description description description " +
        "description "
    }
];

class Course extends Component{
    constructor(props){
        super(props);
        this.state={
            courseToDisplay:this.retrieveCourseToDisplay()
        }
    }
    retrieveCourseToDisplay(){
        let course = courseslist[this.props.match.params.id-1]
        return course;
    }
    render() {
        return (
            <div>
                <div style={{textAlign:'right'}}>
                    <ButtonHelper
                        params={{
                            name: 'newteacher',
                            value: 'New Teacher',
                            className: 'form-helper-button success'
                        }} onClick={() => {
                    }}
                    />
                </div>

                <h2>
                    {this.state.courseToDisplay.title}
                </h2>
                <div>
                    {this.state.courseToDisplay.description}
                    </div>
                <div className={'course-content-div'}>
                    <div style={{textAlign:'right'}}>
                        <ButtonHelper
                            params={{
                                name: 'newsection',
                                value: 'New Section',
                                className: 'form-helper-button success'
                            }} onClick={() => {
                        }}
                        />
                    </div>

                </div>
            </div>
        )
    }
}

export default Course;