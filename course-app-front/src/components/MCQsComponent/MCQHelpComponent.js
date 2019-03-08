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
       /* let reference=this.state.mcq.reference;
        ServerService.postToServer(/)*/

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
    render(){
        return(
            <React.Fragment>
                    <ModalComponent visible={this.state.modalVisibility} onClose={()=>this.handleCloseModal()}>
                        {this.state.modalChildren}
                        </ModalComponent>
                <div className={"mcq-help-option-div"} onClick={()=>this.showCourse()}>Visiter Le Cours</div>
                <div className={"mcq-help-option-div"} onClick={()=>this.showExplanation()}>Explication</div>

            </React.Fragment>
        )
    }

}
export default MCQHelpComponent;