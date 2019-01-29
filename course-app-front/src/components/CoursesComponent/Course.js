import React,{Component} from 'react';
import './course.css';

const courseslist = [
    {
        '_id':1,
        title:"course title ",
        description: "description description" +
        " description description description " +
        "description "
    },
    {
        '_id':2,
        title:"course title",
        description: "description description" +
        " description description description description" +
        " description description ar8gpgipi description description description " +
        "description "
    }, {
        '_id':3,
        title:"course title",
        description: "description description" +
        " description description description description" +
        " description description ar8gpgipi description description description " +
        "description "
    }, {
        '_id':4,
        title:"course titlecourse titlecourse title verugfery goygworgo 8g7o348 qo48gq 74go34879goq84g87g847goq4 87gq",
        description: "description description" +
        " description description description description" +
        " description description ar8gpgipi description description description " +
        "description "
    },
    {
        '_id':5,
        title:"course title",
        description: "description description" +
        " description description description " +
        "description "
    }
];

class CourseHeader extends Component{

}
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
                {"a course view here "+this.props.match.params.id}
            </div>
        )
    }
}

export default Course;