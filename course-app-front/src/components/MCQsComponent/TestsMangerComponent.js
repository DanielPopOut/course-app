import React,{Component} from 'react';
import './testcomponent.css';
import {ServerService} from "../../server/ServerService";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";

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



class TestsManagerComponent extends Component {
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
                    </div>
                    <div>

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default TestsManagerComponent;