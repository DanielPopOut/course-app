import React,{Component} from 'react';
import './coursenavigator.css';
import {ServerService} from "../../server/ServerService";

let lowerCourseLevel={
    courses:'chapters',
    chapters:'sections',
    sections:'subsections'
};

let waitingElement=[{
    title:<img src={"images/al.gif"}/>
}];

class DisplayElement extends Component{
    constructor(props){
        super(props);
        this.state={
            element:this.props.element,
            level:this.props.level,
            subElements:[],
        }
    }
    handleElementClick(){
        this.props.setSelectedElement(this.props.element,this.props.level);
        if(lowerCourseLevel[this.state.level]){
            this.setState({ subElements:[] });
            this.setState({ subElements:waitingElement });
            ServerService.postToServer('/courses/getAllWithIds',{
                collection:lowerCourseLevel[this.state.level],
                elements_ids:this.state.element[lowerCourseLevel[this.state.level]],
                fields:['_id','title',lowerCourseLevel[lowerCourseLevel[this.state.level]]]
            }).then((response)=>{
                if(response.status===200){
                    this.setState({
                        subElements:[]
                    });
                    this.setState({
                        subElements:response.data
                    });
                }else {
                    alert(response.data.errorMessage);
                }
            });
        }
        this.setState({
            selected:true
        })
    }
    selectionState(){
        if(!this.state.selected){
            return "element-div"
        }else {
            return "selected-element-div"
        }
    }
    render(){
        return(
            <div>
                <div
                    className={this.selectionState()}
                    onClick={()=>this.handleElementClick()}
                >
                    {this.state.element.title}
                </div>
                <div className={'sub-elements-div'}>
                    {this.state.subElements.map((subElement,key)=>{
                        return<div key={key}>
                            <DisplayElement
                                element={subElement}
                                level= {lowerCourseLevel[this.state.level]}
                                handleSelection={this.props.handleSelection}
                                setSelectedElement={this.props.setSelectedElement}
                            />
                        </div>;
                    })}
                </div>
            </div>
        );
    }
}
class CourseNavigator  extends Component{
    constructor(props){
        super(props);
        this.state={
            courses:[],
            selectionState:false
        }
    }
    componentDidMount(){
        ServerService.getFromServer('/courses/getAll').then((response)=>{
            if(response.status===200){
                this.setState({ courses:response.data });
            }else {
                alert(response.data.errorMessage);
            }
        });
    }

    handleUnSelectAll(){
        this.setState({
            selectionState:true
        });
        this.setState({
            selectionState:false
        });
    }

    displayElements(level='courses',elements){
        return elements.map((element,key)=>{
            return (
                <div key={key}>
                    <DisplayElement
                        element={element}
                        level={level}
                        setSelectedElement={this.props.setSelectedElement}
                    />
                </div>
            );
        });
    }
    render(){
        return(
            <div>
                <h2 className={"nav-title"}>Navigation </h2>
                {this.displayElements('courses',this.state.courses)}
            </div>
        );
    }
}

export default CourseNavigator;