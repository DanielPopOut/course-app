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

    handleClick(id){
        window.scrollTo(0,document.getElementById(id).offsetTop);
    }

    displayTitle(element,level="courses"){

        return(
            <div className={"course-title-div"}>
                <div className={"nav-course-title "+this.state.selected} onClick={()=>this.handleClick(element._id)}>
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
                                        .map((item,key)=> <React.Fragment key={key}>
                                            {this.displayTitle(item,lowerLevelCollectionName[level])}
                                            </React.Fragment>)
                                }
                            </div>
                        : ""
                    }
            </div>
        );
    }

    render(){
        return(
            <div className={"course-navigator-main-div"}>
                <h3 className={"course-nav-title"}>Navigation Panel</h3>
                {this.displayTitle(this.props.course)}
            </div>
        )
    }
}

export default NavCourse;