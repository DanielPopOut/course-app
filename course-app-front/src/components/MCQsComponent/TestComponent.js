import React, {Component} from 'react';
import './testcomponent.css';
import {ButtonHelper, InputTextHelper} from "../HelperComponent/FormHelper";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import ReactQuill from 'react-quill'; // ES6
import {ServerService} from "../../server/ServerService";
import {displayMessage} from "../../server/axiosInstance";
import {RealiseMCQ} from "./MCQsComponent";
import MCQHelpComponent from "./MCQHelpComponent";
import DataManagerPage from "../DanielComponent/DataManagerPage/DataManagerPage";

export class TestResult extends Component{

    constructor(props){
        super(props);
        this.state={
            testTitle:this.props.testTitle,
            correctedMcqs:this.props.correctedMcqs||[],
            failedMcqs:this.props.failedMcqs||[],
            current:'',
        }
    }

    componentWillMount(){
        if(this.props.failedMcqs.length>0){
            this.setState({
                current:0
            });
        }
    }

    displayTestScore(){
        return(
            <div>
                Score :
                {this.state.correctedMcqs.length-this.state.failedMcqs.length}
                    /
                {this.state.correctedMcqs.length}
            </div>
        );
    }

    handleNext(){
        let currentindex=this.state.failedMcqs.indexOf(this.state.current);
        if(currentindex<this.state.failedMcqs.length -1){
            this.setState({
                current:this.state.failedMcqs[currentindex+1],
            });
        }
    }

    handlePrevious(){
        let currentindex=this.state.failedMcqs.indexOf(this.state.current);
        if(currentindex>0){
            this.setState({
                current:this.state.failedMcqs[currentindex-1],
            });
        }
    }

    displayPrevNext(PrevOrNext){
        if(PrevOrNext==="prev"){
            return(
                <div>
                   <ButtonHelper
                       {
                           ...{
                               name:"prevbutton",
                               value:"<<",
                               className:"form-helper-button warning"
                           }
                       }
                       onClick={()=>this.handlePrevious()}
                   />
                </div>
            );
        }else {
            return (
                <div>
                    <ButtonHelper
                        {
                            ...{
                                name: "prevbutton",
                                value: ">>",
                                className: "form-helper-button warning"
                            }
                        }
                        onClick={() => this.handleNext()}
                    />
                </div>
            );
        }
    }

    handleFailedMcqClick(index){
        this.setState({
            current:index
        });
    }

    displayResult(){
        if(this.state.failedMcqs.length>0){
            return this.state.correctedMcqs.map((mcq,key)=>{
                if(key===this.state.current){
                    return(<div key={key}><RealiseMCQ {...mcq}/></div>)
                }
            });
        }else {
            return(<div className={"passed-test-div"}>You have succeed the Test !!</div>);
        }
    }

    render(){
        return(
            <div>
                <div className={"test-result-title"}> {this.state.testTitle||"No Title"}</div>
                <div className={"test-score-div"}> {this.displayTestScore()} </div>
                <div className={'test-result-div'}>
                    <div>
                        <h4 className={"title-failed-result"}> Failed Result </h4>
                        <div className={"failed-mcq-number"}>
                            {
                                this.state.failedMcqs.map((index,key)=>{
                                    return(
                                        <div
                                            key={key}
                                            onClick={()=>this.handleFailedMcqClick(index)}
                                        >
                                            {index}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={"failed-mcq-div"}>
                        <div className={"previous"}>{this.displayPrevNext("prev")}</div>
                        <div>{this.displayResult()}</div>
                        <div className={'next'}> {this.displayPrevNext("next")} </div>
                    </div>
                </div>
            </div>
        );
    }

}

export class RunningTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: this.props.test,
            mcqs: [],
            totalNumberOfMcqs: this.props.test.mcqs.length,
            currentMcqIndex: 0,
            currentMCQ: "",
            correctedMCQS:[],
            failedMCQS:[],
            modalChildren:"",
            modalVisibility:false
        }
    }

    async getCorrectedMCQ(correctedMcqState, key) {
        /*let correctedmcq = <RealiseMCQ {...correctedMcqState} />;*/
        let correctedMCQS = this.state.correctedMCQS;
        if(correctedMcqState.mode==="correctedAndWrong"){
            let failedMCQS=this.state.failedMCQS;
            if(failedMCQS.indexOf(key) === -1){
                failedMCQS.push(key);
                await this.setState({failedMCQS:failedMCQS});
            }
        }
        correctedMCQS[key] = correctedMcqState;
        console.log("corrected MCQ ",this.state.correctedMCQS);
        await this.setState({ correctedMCQS: correctedMCQS});
        await this.handleNextMCQ();
    }

    componentWillMount() {
        let mcqs = this.props.test.mcqs;
        if (mcqs.length > 0) {
            this.setState({
                mcqs: mcqs,
                totalNumberOfMcqs: mcqs.length,
                currentMcqIndex: 0,
                currentMCQ: mcqs[0]
            });
        } else {
            this.setState({
                mcqs: [],
                totalNumberOfMcqs: 0,
                currentMcqIndex: '',
                currentMCQ: ''
            });
        }
    }

    displayCurrentTestMCQ(key) {
        console.log("current MCQ ", this.state.currentMCQ);
        if (this.state.currentMCQ) {
            return  <RealiseMCQ mcq={this.state.currentMCQ} getCorrectedMCQ={(mcqState) => this.getCorrectedMCQ(mcqState, key)}/>;
        } else {
            //(this.state.currentMCQ);
             return "";
        }
    }

    async handlePreviousMCQ() {
        console.log("current Index ", this.state.currentMcqIndex);
        let currentMcqIndex = this.state.currentMcqIndex;
        let nextMcqIndex = currentMcqIndex - 1;

        await this.setState({
            currentMCQ: ""
        });
        await this.setState({
            currentMcqIndex: nextMcqIndex,
            currentMCQ: this.state.mcqs[nextMcqIndex]
        });
        console.log("new Index ", this.state.currentMcqIndex);
    }

    async handleNextMCQ() {
        console.log("current Index ", this.state.currentMcqIndex);
        let currentMcqIndex = this.state.currentMcqIndex;
        let nextMcqIndex = currentMcqIndex + 1;

        await this.setState({
            currentMcqIndex: nextMcqIndex,
            currentMCQ: ""
        });
        if(nextMcqIndex<=this.state.totalNumberOfMcqs-1){
            await this.setState({
                currentMcqIndex: nextMcqIndex,
                currentMCQ: this.state.mcqs[nextMcqIndex]
            });
        }
        console.log("new Index ", this.state.currentMcqIndex);
    }

    displayPrevNextButtons() {
        return (
            <React.Fragment>
                {/*{
                    this.state.currentMcqIndex > 0 ?
                    <ButtonHelper
                        {...{
                            name: 'previousMCQButton',
                            value: "Previous",
                            className: "form-helper-button success"
                        }}
                        onClick={() => {
                            this.handlePreviousMCQ()
                        }}
                    /> : ''
                }
                {
                    this.state.currentMcqIndex < this.state.totalNumberOfMcqs - 1 ?
                        <ButtonHelper
                            {...{
                                name: 'nextMCQButton',
                                value: "Next",
                                className: "form-helper-button success"
                            }}
                            onClick={() => {
                                this.handleNextMCQ()
                            }}
                        /> : ''
                }*/}
                {
                    this.state.currentMcqIndex===this.state.totalNumberOfMcqs?
                        <React.Fragment>
                            <ButtonHelper
                                {
                                    ...{
                                        name: 'testvalidationButton',
                                        value: "Valider Le Test",
                                        className: "form-helper-button success"
                                    }
                                }
                                onClick={() => {
                                    this.validateTest()
                                }}
                            />
                            <ButtonHelper
                                {
                                    ...{
                                        name: 'testvalidationButton',
                                        value: "Reprendre Le Test",
                                        className: "form-helper-button warning"
                                    }
                                }
                                onClick={() => {
                                    this.repeatTest()
                                }}
                            />
                        </React.Fragment>:""
                }
            </React.Fragment>
        );
    }

    validateTest() {
        this.props.handleOpenModal(
            <TestResult
                testTitle={this.state.test.title}
                correctedMcqs={this.state.correctedMCQS}
                failedMcqs={this.state.failedMCQS}
            />
        );
    }

    repeatTest(){
        this.setState({
            currentMcqIndex: 0,
            currentMCQ: this.state.mcqs[0]
        });
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

    render() {
        return (
            <div className={"runningTest-div"}>
                <div >
                    <ModalComponent
                        onClose={()=>this.handleCloseModal()}
                        visible={this.state.modalVisibility}
                    >
                        {this.state.modalChildren}
                    </ModalComponent>
                </div>
                <div> {this.state.test.title || "DeFault Title"} </div>
                <div>
                    {this.displayCurrentTestMCQ(this.state.currentMcqIndex)}
                </div>
                <div className={"hr-button-block"}>
                    {this.displayPrevNextButtons()}
                </div>
            </div>
        )
    }

}

export class TestsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reference: this.props.reference,
            course_level: this.props.course_level,
            tests: [],
            modalChildren: "",
            modalVisibility: false
        }
    }

    componentDidMount() {
        let dataToSend = {
            reference: this.props.reference,
            course_level: this.props.course_level
        };
        console.log("tests list params", dataToSend);
        ServerService.postToServer('/mcquestions/getTestsOfLevel', dataToSend).then((response) => {
            if (response.status === 200) {
                console.log("list of Tests Founded ", response.data);
                this.setState({
                    tests: response.data,
                });
            } else {
                alert(response.data.errorMessage);
            }
        });
    }

    handleCloseModal() {
        this.setState({
            modalChildren: "",
            modalVisibility: false
        })
    }

    showCurrentTest() {
        if (this.state.currentTest.length > 0) {
            let currenttest = this.state.currentTest;
            return (
                <div>
                    <div>{currenttest.title}</div>
                    <div>
                        {
                            currenttest.mcqs.map((mcq, key) => {
                                return (
                                    <div key={key}>

                                    </div>
                                );
                            })
                        }
                    </div>

                </div>
            );
        }
    }

    handleOpenModal(content) {
        this.setState({
            modalChildren: content,
            modalVisibility: true
        });
    }

    runTest(test) {
        let runningTest =
            <RunningTest
                test={test}
                handleOpenModal={(content)=>this.handleOpenModal(content)}
            />;
        this.handleOpenModal(runningTest);
    }

    displayTest(test, key) {
        return (
            <div key={key} className={"test-list-title"}>
                {test.title || "No Title "}
                <div className={"runtest-button-div"}>
                    <ButtonHelper
                        {
                            ...{
                                name: "runTestButton",
                                value: "Run A Test",
                                className: "form-helper-button success"
                            }
                        }
                        onClick={() => {
                            this.runTest(test)
                        }}
                    />
                </div>
            </div>
        );
    }

    render() {
        return (
            <React.Fragment>
                <ModalComponent visible={this.state.modalVisibility} onClose={() => this.handleCloseModal()}>
                    {this.state.modalChildren}
                </ModalComponent>
                <div className={"show-test-div"}>
                    {
                        this.state.tests.map((test, key) => {
                            return this.displayTest(test, key);
                        })
                    }
                </div>
            </React.Fragment>

        );
    }
}

export class OneTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test_id: this.props.test_id || '',
            title: "",
            reference: this.props.reference,
            course_level: this.props.course_level,
            originalmcqs: this.props.mcqs,
            mcqs: this.props.mcqs,
            selectedmcqs: this.props.selectedmcqs || []
        }
    }

    displayOneMCQ(mcq) {
        return (<ReactQuill value={mcq.question || ""} modules={{toolbar: false}} readOnly={true}/>)
    }

    handleAddMCQS(mcq) {
        console.log("adding mcq ", mcq);
        let newselectedmcqs = this.state.selectedmcqs;
        let newmcqs = this.state.mcqs;
        newselectedmcqs.push(mcq);
        newmcqs.splice(newmcqs.indexOf(mcq), 1);
        this.setState({
            mcqs: newmcqs,
            selecetedmcqs: newselectedmcqs
        });
    }

    handleRemoveMCQS(mcq) {
        console.log("remove mcq ", mcq);
        let newselectedmcqs = this.state.selectedmcqs;
        let newmcqs = this.state.mcqs;
        newmcqs.push(mcq);
        newselectedmcqs.splice(newselectedmcqs.indexOf(mcq), 1);
        this.setState({
            mcqs: newmcqs,
            selecetedmcqs: newselectedmcqs
        });
    }

    createNewTest() {
        // check empty selected questions
        let selectedmcqs = this.state.selectedmcqs;
        if (this.state.title.length === 0) {
            alert("Le test doit avoir un titre");
            return;
        }
        if (selectedmcqs.length > 0) {
            let selectedmcqs_ids = [];
            //gathering ids of  selected mcqs
            for (let mcq of selectedmcqs) {
                selectedmcqs_ids.push(mcq._id);
            }
            let dataTosend = {
                title: this.state.title,
                reference: this.state.reference,
                course_level: this.state.course_level,
                mcqs: selectedmcqs_ids
            };

            ServerService.postToServer('/mcquestions/newTest', dataTosend).then((response) => {
                console.log("here too");
                if (response.status === 200) {
                    console.log("test result", response.data);
                    this.setState({
                        test_id: response.data
                    });
                    displayMessage(" New Test Saved with Success !!");
                } else {
                    displayMessage(response.data.errorMessage);
                }
            });

        } else {
            alert("Vous devez Selectionner au moins une question");
        }
    }

    modifyTest() {
        let selectedmcqs = this.state.selectedmcqs;
        if (selectedmcqs.length > 0) {
            let selectedmcqs_ids = [];
            //gathering ids of  selected mcqs
            for (let mcq of selectedmcqs) {
                selectedmcqs_ids.push(mcq._id);
            }
            let dataTosend = {
                document: {_id: this.state.test_id},
                updates: {
                    title: this.state.title,
                    reference: this.state.reference,
                    course_level: this.state.course_level,
                    selectedmcqs_ids: selectedmcqs_ids
                }
            };
            ServerService.postToServer('/mcquestions/modifyTest', dataTosend).then((response) => {
                if (response.status === 200) {
                    displayMessage(" Test modified with Success !!");
                } else {
                    displayMessage(response.data.errorMessage);
                }
            });

        } else {
            alert("Vous devez Selectionner au moins une question");
        }
    }

    handleTitleChange(elt) {
        this.setState({
            title: elt.target.value
        });
    }

    setNewTest() {
        let originalmcqs = this.state.originalmcqs;
        this.setState({
            test_id: '',
            mcqs: originalmcqs
        });
    }

    displayTestButton() {
        if (this.state.test_id.length === 0) {
            return (
                <ButtonHelper
                    {
                        ...{
                            name: 'validateTestCreation',
                            value: 'Valider',
                            className: "form-helper-button success",
                        }
                    }
                    onClick={() => this.createNewTest()}
                />
            );
        } else {
            return (
                <React.Fragment>
                    <ButtonHelper
                        {
                            ...{
                                name: 'modifyTestButton',
                                value: 'Modify',
                                className: "form-helper-button success",
                            }
                        }
                        onClick={() => this.modifyTest()}
                    />
                    <ButtonHelper
                        {
                            ...{
                                name: 'newTestButton',
                                value: 'NewTest',
                                className: "form-helper-button success",
                            }
                        }
                        onClick={() => this.setNewTest()}
                    />
                </React.Fragment>
            );
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className={'test-creation-header'}>

                    {
                        this.displayTestButton()
                    }
                    <h2>
                        Création d'Un Test
                    </h2>
                    <InputTextHelper {...{
                        name: "testName",
                        placeholder: "Titre Du Test",
                        className: "form-helper-input test-title-input"
                    }}
                                     onChange={(e) => {
                                         this.handleTitleChange(e)
                                     }}
                    />
                </div>
                <div className={"one-test-div"}>
                    <div className={"mcqs-list"}>
                        <h3> Liste Des QCMs </h3>
                        {
                            this.state.mcqs.map((mcq, key) => {
                                return (
                                    <div className={'one-mcq-test-div'} key={key}
                                         onClick={() => this.handleAddMCQS(mcq)}>
                                        {this.displayOneMCQ(mcq)}
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className={"selected-mcqs-list"}>
                        <h3> Liste Des QCMs Selectionnés </h3>
                        {
                            this.state.selectedmcqs.map((mcq, key) => {
                                return (
                                    <div className={'one-mcq-test-div'} key={key}
                                         onClick={() => this.handleRemoveMCQS(mcq)}>
                                        {this.displayOneMCQ(mcq)}
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

class TestComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisibility: false,
            modalChildren: '',
            reference: this.props.reference,
            course_level: this.props.course_level,
        }
    }

    buildTest() {
        let dataObjet = {
            reference: this.state.reference,
            course_level: this.state.course_level
        };
        ServerService.postToServer('/mcquestions/getMCQsOfLevel', dataObjet).then((response) => {
            if (response.status === 200) {
                console.log("list of MCQs Founded ", response.data);
                this.setState({
                    modalChildren: <OneTest
                        reference={this.state.reference}
                        course_level={this.state.course_level}
                        mcqs={response.data}
                    />,
                    modalVisibility: true,
                });
            } else {
                alert(response.data.errorMessage);
            }
        });
    }

    handleClose() {
        this.setState({
            modalVisibility: false,
            modalChildren: ""
        });
    }

    listTests() {
        this.setState({
            modalChildren: <TestsList
                reference={this.state.reference}
                course_level={this.state.course_level}
            />,
            modalVisibility: true,
        });
    }

    render() {
        return (
            <div>
                <ModalComponent visible={this.state.modalVisibility}
                                onClose={() => this.handleClose()}>
                    {this.state.modalChildren}
                </ModalComponent>
                <ButtonHelper
                    {...{
                        name: 'testConstructorButton',
                        value: 'Produce A Test',
                        className: "form-helper-button warning produce-test-button"
                    }}
                    onClick={() => this.buildTest()}
                />
                <ButtonHelper
                    {...{
                        name: 'testsViewButton',
                        value: 'List of Tests',
                        className: "form-helper-button warning produce-test-button"
                    }}
                    onClick={() => this.listTests()}
                />

            </div>
        );
    }
}

export default TestComponent;