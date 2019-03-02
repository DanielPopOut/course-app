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
            subElements:[]
        }
    }
    handleElementClick(){
        let newOneMCQ=<OneMCQ  course_level={this.state.course_level} reference={this.state.reference} />;
        this.props.handleSelection(newOneMCQ);
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

    }
    render(){
        return(
            <div>
                <div className={'element-div'} onClick={()=>this.handleElementClick()}>
                   {this.state.element.title}
                </div>
                <div className={'sub-elements-div'}>
                    {this.state.subElements.map((subElement,key)=>{
                        return<div key={key}>
                                <DisplayElement element={subElement}
                                               level= {lowerCourseLevel[this.state.level]}
                                               handleSelection={this.props.handleSelection}
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
            courses:[]
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

    displayElements(level='courses',elements){
        return elements.map((element,key)=>{
            return (
                <div key={key}>
                    <DisplayElement
                        handleSelection={this.props.handleSelection}
                        element={element}
                        level={level}
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
            mcqForm:'',
            modalVisibility: false,
            modalChildren: ""
        }
    }

    handleOpenModal() {
        this.setState({
            modalVisibility: true,
            modalChildren: ""
        })
    }

    handleSelection(newOneMCQ){
        this.setState({mcqForm:newOneMCQ });
    }
    handleClose() {
        this.setState({
            modalVisibility: false,
            modalChildren: ""
        });
    }

    render() {
        return (
            <React.Fragment>
                <ModalComponent visible={this.state.modalVisibility} onClose={()=>this.handleClose()}>
                    {this.state.modalChildren}
                </ModalComponent>
                <div className={"mcqs-manager-body"}>
                    <div className={"location-div"}>
                        <h2>Level Location</h2>
                        <NewMCQLocation handleSelection={(newOneMCQ)=>this.handleSelection(newOneMCQ)}/>
                    </div>
                    <div>
                        {this.state.mcqForm}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default MCQsManagerComponent;





