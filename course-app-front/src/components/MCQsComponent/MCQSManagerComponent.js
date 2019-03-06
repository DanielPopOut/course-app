import React, {Component} from 'react';
import './mcqsmanagercomponent.css';
import {ButtonHelper} from "../HelperComponent/FormHelper";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import ReactQuill from 'react-quill'; // ES6
import CourseNavigator from './CourseNavigator';
import {ServerService} from "../../server/ServerService";
import {OneMCQ} from "./MCQsComponent";

class MCQSManagerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reference:'none',
            level:'none',
            selectedElement:{}
        };
    }
    handleClose() {
        this.setState({
            modalVisibility: false,
            modalChildren: "",
        });
    }
    setSelectedElement(element,level){
        console.log("selected",element," level ",level);
        this.setState({
            reference:element._id,
            level:level,
            selectedElement:element
        });
    }

   returnInfos(){
        return(
            <div className={'selected-course-infos'}>
                {/*<span>
                    <div>ref:<span>{this.state.reference}</span></div>
                    <div>level:<span>{this.state.level}</span></div>
                </span>*/}
                <span>
                    {this.state.selectedElement.title||""}
                </span>
            </div>
        );
   }
    newMCQ(){

    }
    listMCQS(){

    }
    newTEST(){

    }
    listTESTS(){

    }
    render() {
        return (
            <React.Fragment>
                {this.returnInfos()}
                <ModalComponent visible={this.state.modalVisibility} onClose={()=>this.handleClose()}>
                    {this.state.modalChildren}
                </ModalComponent>
                <div className={"mcqs-manager-body"}>
                    <div className={"location-div"}>

                        <CourseNavigator setSelectedElement={(element,level)=>this.setSelectedElement(element,level)}/>
                      {/*  <NewMCQLocation handleSelection={(reference,level)=>this.handleSelection(reference,level)}/>*/}
                    </div>
                    <div className={"div-options"}>
                        <div className={"options-div"}>
                            <h3>  MCQS Options</h3>
                            <div>
                                <ButtonHelper {...{
                                    name: 'newmcq',
                                    value: "New MCQ",
                                    className: "form-helper-button success"
                                }} onClick={() => this.newMCQ()}
                                />
                                <ButtonHelper {...{
                                    name: 'listmcqs',
                                    value: "List MCQs",
                                    className: "form-helper-button success"
                                }} onClick={() => this.listMCQS()}
                                />
                            </div>
                        </div>

                        <div className={"options-div"}>
                            <h3>TESTS Options</h3>
                            <div>
                                <ButtonHelper {...{
                                    name:'newtest',
                                    value:"New TEST",
                                    className:"form-helper-button success"
                                }} onClick={()=>this.newTEST()}
                                />
                                <ButtonHelper {...{
                                    name:'listtests',
                                    value:"List TESTS",
                                    className:"form-helper-button success"
                                }} onClick={()=>this.listTESTS()}
                                />
                            </div>
                        </div>

                        {/*<OneMCQ reference={this.state.reference} course_level={this.state.level}/>*/}
                    </div>
                </div>
                <div className={"activity-div"}>

                </div>
            </React.Fragment>
        );
    }
}

export default MCQSManagerComponent;





