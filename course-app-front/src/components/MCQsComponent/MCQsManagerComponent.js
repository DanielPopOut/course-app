import React, {Component} from 'react';
import './mcqsmanagercomponent.css';
import {ButtonHelper, CheckBoxHelper, LabelHelper, RadioHelper} from "../HelperComponent/FormHelper";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import ReactQuill from 'react-quill'; // ES6
import {ServerService} from "../../server/ServerService";
import {OneMCQ} from "./MCQsComponent";


let lowerCourseLevel={
    courses:'chapters',
    chapters:'sections',
    sections:'subsections'
};
let waitingElement=[{
    title:<img src={"images/al.gif"}/>
}];
let formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'align',
    'link', 'image', 'formula',
];
let modules = {
    toolbar: [
        [{'header': [1, 2, false]}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        [{'align': []}],
        ['link', 'image', 'formula'],
        ['clean'],
    ],
};


class DisplayElement extends Component{
    constructor(props){
        super(props);
        this.state={
            element:this.props.element,
            level:this.props.level,
            subElements:[],
            selected:this.props.selectionState
        }
    }
    handleElementClick(){
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
        this.props.handleSelection(this.state.element._id,this.state.level);
        this.props.handleUnSelectAll();
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
                <div className={this.selectionState()} onClick={()=>this.handleElementClick()}>
                   {this.state.element.title}
                </div>
                <div className={'sub-elements-div'}>
                    {this.state.subElements.map((subElement,key)=>{
                        return<div key={key}>
                                <DisplayElement
                                    element={subElement}
                                    level= {lowerCourseLevel[this.state.level]}
                                    handleSelection={this.props.handleSelection}
                                    handleUnSelectAll={this.props.handleUnSelectAll}
                                    selectionState={this.props.selectionState}
                                />
                        </div>;
                    })}
                </div>
            </div>
        );
    }
}
class NewMCQLocation  extends Component{
    constructor(props){
        super(props);
        this.state={
            courses:[],
            selectionState:false
        }
    }
    componentWillMount(){
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
                        handleSelection={this.props.handleSelection}
                        element={element}
                        level={level}
                        handleUnSelectAll={()=>this.handleUnSelectAll()}
                        selectionState={this.state.selectionState}
                    />
                </div>
            );
        });
    }
    render(){
        return(
            <div>
                {this.displayElements('courses',this.state.courses)}
            </div>
        );
    }
}

class MCQsManagerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reference:'fewewf',
            level:'none',
            modalVisibility: false,
            modalChildren: ""
        };
        this.handleSelection=this.handleSelection.bind(this);
    }

    handleOpenModal() {
        this.setState({
            modalVisibility: true,
            modalChildren: ""
        });
    }

    handleSelection(reference,level){
        this.setState({
            reference:reference,
            level:level
        },()=>{
            console.log("Selection : reference ",reference, " level ",level);
            this.forceUpdate();
        });
    }
    handleClose() {
        this.setState({
            modalVisibility: false,
            modalChildren: ""
        });
    }

    checkchanged(){
        return this.state.level;
    }

    render() {
        return (
            <React.Fragment>
                {this.checkchanged()}
                <ModalComponent visible={this.state.modalVisibility} onClose={()=>this.handleClose()}>
                    {this.state.modalChildren}
                </ModalComponent>
                <div className={"mcqs-manager-body"}>
                    <div className={"location-div"}>
                        <h2>Level Location</h2>
                        <NewMCQLocation handleSelection={(reference,level)=>this.handleSelection(reference,level)}/>
                    </div>
                    <div>
                        <OneMCQ reference={this.state.reference} course_level={this.state.level}/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default MCQsManagerComponent;





