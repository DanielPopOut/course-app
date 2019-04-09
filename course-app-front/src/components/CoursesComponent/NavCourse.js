import React,{Component} from "react";
import "./navcourse.css";

let lowerLevelCollectionName = {
    courses: 'chapters',
    chapters: 'sections',
    sections: 'subsections'
};



class NavCourse extends Component{
    constructor(props){
        super(props);
        this.state={
            selected:""
        }

    }

    handleClick(e,element,level){
        console.log("e",e);
        if(this.props.handleClick){
            this.props.handleClick(element,level);
        }
    }
    displayTitle(element,level="courses"){
        return(
            <div className={"course-title-div"}>
                <div className={"nav-course-title "+this.state.selected} onClick={(e)=>this.handleClick(e,element,level)}>
                    {element.title}
                    </div>
                    {
                        element.hasOwnProperty(lowerLevelCollectionName[level])
                        &&
                        element[lowerLevelCollectionName[level]].length>0
                        ?
                            <div className={"course-nav-sub-titles-div"}>
                                {
                                    element[lowerLevelCollectionName[level]]
                                        .map(item=> this.displayTitle(item,lowerLevelCollectionName[level]))
                                }
                            </div>
                            :
                            ""
                    }
            </div>
        );
    }
    displaySubtitle(){

    }

    render(){
        return(
            <div className={"course-navigator-main-div"}>
                <h3>Navigation</h3>
                {this.displayTitle(this.props.course)}
            </div>
        )
    }
}

export default NavCourse;