import React, {Component} from 'react';
import './mcqsmanagercomponent.css';
import {ButtonHelper, CheckBoxHelper, LabelHelper, RadioHelper} from "../HelperComponent/FormHelper";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import ReactQuill from 'react-quill'; // ES6
import {ServerService} from "../../server/ServerService";
import {OneMCQ} from "./MCQsComponent";

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

class NewMCQLocation  extends Component{
    constructor(props){
        super(props);
        this.state={}
    }
    render(){
        return(
            <div>
                Location
            </div>
        );
    }
}

class MCQsManagerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reference:this.props.reference,
            course_level:this.props.course_level,
            modalVisibility: false,
            modalChildren: ""
        }
    }

    handleNewMCQ() {
        this.setState({
            modalVisibility: true,
            modalChildren: <OneMCQ  reference={this.state.reference} course_level={this.state.course_level} />
        })
    }

    handleClose() {
        this.setState({
            modalVisibility: false,
            modalChildren: ""
        });
    }

    render() {
        return (
            <div className={"mcqs-manager-body"}>
               {/* <div>
                    <ModalComponent visible={this.state.modalVisibility} onClose={() => {
                        this.handleClose()
                    }}>
                        {this.state.modalChildren}
                    </ModalComponent>
                    <ButtonHelper
                        {
                            ...{
                                name: 'newMCQ',
                                value: 'New M.C.Q',
                                className: 'form-helper-button success new-mcq-button'
                            }
                        }
                        onClick={() => this.handleNewMCQ()}
                    />
                </div>*/}
                <div>
                    <NewMCQLocation/>
                </div>
                <div>
                    <OneMCQ/>
                </div>
            </div>
        );
    }
}

export default MCQsManagerComponent;





