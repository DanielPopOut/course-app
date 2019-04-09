import React, {Component} from 'react';
import './mcqsmanagercomponent.css';
import {ButtonHelper} from "../HelperComponent/FormHelper";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import ReactQuill from 'react-quill'; // ES6
import CourseNavigator from './CourseNavigator';
import {ServerService} from "../../server/ServerService";
import {ListMCQS, OneMCQ} from "./MCQsComponent";
import {OneTest, TestsList} from "./TestComponent";

class MCQSManagerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reference: 'none',
            level: 'none',
            selectedElement: {},
            activityContent: ''
        };
    }

    handleClose() {
        this.setState({
            modalVisibility: false,
            modalChildren: "",
        });
    }

    setSelectedElement(element, level) {
        console.log("selected", element, " level ", level);
        this.setState({
            reference: element._id,
            level: level,
            selectedElement: element,
            activityContent: ""
        });
    }

    returnInfos() {
        return (
            <div className={'selected-course-infos'}>
                {/*<span>
                    <div>ref:<span>{this.state.reference}</span></div>
                    <div>level:<span>{this.state.level}</span></div>
                </span>*/}
                <span>
                    {this.state.selectedElement.title || ""}
                </span>
            </div>
        );
    }

    newMCQ() {
        this.setState({
            activityContent: <OneMCQ reference={this.state.reference} course_level={this.state.level}/>
        });
    }

    listMCQS() {
        let dataObjet = {
            reference: this.state.reference,
            course_level: this.state.level
        };
        ServerService.postToServer('/mcquestions/getMCQsOfLevel', dataObjet).then((response) => {
            if (response.status === 200) {
                console.log("list of MCQs Founded ", response.data);
                this.setState({
                    activityContent: <ListMCQS
                        reference={this.state.reference}
                        course_level={this.state.course_level}
                        mcqs={response.data}
                    />,
                });
            } else {
                alert(response.data.errorMessage);
            }
        });
    }

    newTEST() {
        let dataObjet = {
            reference: this.state.reference,
            course_level: this.state.level
        };
        ServerService.postToServer('/mcquestions/getMCQsOfLevel', dataObjet).then((response) => {
            if (response.status === 200) {
                console.log("list of MCQs Founded ", response.data);
                this.setState({
                    activityContent: <OneTest
                        reference={this.state.reference}
                        course_level={this.state.level}
                        mcqs={response.data}
                    />,
                });
            } else {
                alert(response.data.errorMessage);
            }
        });
    }

    listTESTS() {
        console.log("selected element ", this.state.selectedElement);
        this.setState({
            activityContent:<TestsList reference={this.state.reference} course_level={this.state.level} />
        });
    }

    showActivityContent() { return (this.state.activityContent); }

    render() {
        return (
            <div className={"mcqs-manager-container"}>
                <ModalComponent visible={this.state.modalVisibility} onClose={() => this.handleClose()}>
                    {this.state.modalChildren}
                </ModalComponent>
                <div className={"mcqs-manager-body"}>
                    <div className={"location-div"}>
                        <CourseNavigator setSelectedElement={(element, level) => this.setSelectedElement(element, level)}/>
                    </div>
                    <div>
                        <div className={"div-options"}>
                            <div className={"options-div"}>
                                <h3> MCQS Options</h3>
                                <div className={"hr-button-block"}>
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
                                <div className={"hr-button-block"}>
                                    <ButtonHelper {...{
                                        name: 'newtest',
                                        value: "New TEST",
                                        className: "form-helper-button success"
                                    }} onClick={() => this.newTEST()}
                                    />
                                    <ButtonHelper {...{
                                        name: 'listtests',
                                        value: "List TESTS",
                                        className: "form-helper-button success"
                                    }} onClick={() => this.listTESTS()}
                                    />
                                </div>
                            </div>
                        </div>
                        {this.returnInfos()}
                        <div className={"activity-div"}>
                            {this.showActivityContent()}
                        </div>
                    </div>

                </div>

            </div>
        );
    }
}

export default MCQSManagerComponent;





