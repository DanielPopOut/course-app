import React,{Component} from 'react';
import './mcqhelpcomponent.css';
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import ReactQuill from 'react-quill';
import {ServerService} from "../../server/ServerService"; // ES6

let formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'align',
    'link', 'image', 'formula',
];

class MCQHelpComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            mcq:this.props.mcq,
            modalVisibility:false,
            modalChildren:""
        }
    }
    handleCloseModal(){
        this.setState({
           modalChildren:"",
           modalVisibility:false
        });
    }
    handleOpenModal(content){
        this.setState({
            modalChildren:content,
            modalVisibility:true
        });
    }
    showCourse(){
        let reference=this.state.mcq.reference;
        let course_level=this.state.mcq.course_level;
        let dataToSend={
            elements_ids:[reference],
            elements_collection:course_level
        };
        ServerService.postToServer("/courses/getCourseElements",dataToSend).then((response)=>{
            if(response.status===200){
                console.log("course elements ",response.data);
            }else {
                console.log("error message ",response.data.errorMessage);
            }
        });
    }
    showExplanation(){
        let explanation=<div>
            <h3>Explanation</h3>
            <ReactQuill
                value={this.state.mcq.explanation}
                modules={{toolbar:false}}
                formats={formats}
                readOnly={true}
            />
        </div>;
            this.handleOpenModal(<div className={"mcq-help-explanation-div"}> {explanation}</div>)
    }
    displayOptions(){
        if(this.state.mcq.explanation.length>0){
            return(
                <React.Fragment>
                    <div className={"mcq-help-option-div"} onClick={()=>this.showCourse()}>Visiter Le Cours</div>
                    <div className={"mcq-help-option-div"} onClick={()=>this.showExplanation()}>Explication</div>
                </React.Fragment>
            );
        }else {
            return(
                <div className={"mcq-help-option-div"} onClick={()=>this.showCourse()}>
                    Visiter Le Cours
                </div>
            );
        }
    }
    render(){
        return(
            <React.Fragment>
                    <ModalComponent visible={this.state.modalVisibility} onClose={()=>this.handleCloseModal()}>
                        {this.state.modalChildren}
                        </ModalComponent>
                {this.displayOptions()}
            </React.Fragment>
        )
    }

}
export default MCQHelpComponent;