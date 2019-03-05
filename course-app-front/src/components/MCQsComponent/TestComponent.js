import React, {Component} from 'react';
import './testcomponent.css';
import {ButtonHelper, InputTextHelper} from "../HelperComponent/FormHelper";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import ReactQuill from 'react-quill'; // ES6
import {ServerService} from "../../server/ServerService";
import {displayMessage} from "../../server/axiosInstance";

class ListsTests extends Component{
    constructor(props){
        super(props);
        this.state={
            reference:this.props.reference,
            course_level:this.props.course_level,
            tests: this.props.tests || [],
            currentTest:{}
        }
    }

    showMcq(mcq){
        return(<div>

        </div>);
    }

    showCurrentTest(){
        if(this.state.currentTest.length>0){
            let currenttest=this.state.currentTest;
            return (
                <div>
                    <div>{currenttest.title}</div>
                    <div>
                        {
                            currenttest.mcqs.map((mcq,key)=>{
                                return(
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

    render(){
        return(
            <div className={"show-test-div"}>
               <div>  </div>
               <div>{this.showCurrentTest()}</div>
               <div></div>
            </div>
        );
    }
}

class OneTest extends Component{
    constructor(props){
        super(props);
        this.state={
            test_id:this.props.test_id||'',
            title:"",
            reference:this.props.reference,
            course_level:this.props.course_level,
            originalmcqs:this.props.mcqs,
            mcqs:this.props.mcqs,
           selectedmcqs:this.props.selectedmcqs ||[]
        }
    }

    displayOneMCQ(mcq){
        return(<ReactQuill value={mcq.question || ""} modules={{toolbar: false}} readOnly={true}/>)
    }

    handleAddMCQS(mcq){
        console.log("adding mcq ",mcq);
        let newselectedmcqs=this.state.selectedmcqs;
        let newmcqs=this.state.mcqs;
        newselectedmcqs.push(mcq);
        newmcqs.splice(newmcqs.indexOf(mcq),1);
        this.setState({
            mcqs:newmcqs,
            selecetedmcqs:newselectedmcqs
        });
    }

    handleRemoveMCQS(mcq){
        console.log("remove mcq ",mcq);
        let newselectedmcqs=this.state.selectedmcqs;
        let newmcqs=this.state.mcqs;
        newmcqs.push(mcq);
        newselectedmcqs.splice(newselectedmcqs.indexOf(mcq),1);
        this.setState({
            mcqs:newmcqs,
            selecetedmcqs:newselectedmcqs
        });
    }

    createNewTest(){
        // check empty selected questions
        let selectedmcqs=this.state.selectedmcqs;
        if(selectedmcqs.length>0){
            let selectedmcqs_ids=[];
            //gathering ids of  selected mcqs
            for (let mcq of selectedmcqs ){
                selectedmcqs_ids.push(mcq._id);
            }
            let dataTosend={
                title:this.state.title,
                reference:this.state.reference,
                course_level:this.state.course_level,
                selectedmcqs_ids:selectedmcqs_ids
            };
            console.log("Here");
            ServerService.postToServer('/mcquestions/newTest',dataTosend).then((response)=>{
                console.log("here too");
                if(response.status===200){
                    console.log("test result",response.data);
                    this.setState({
                        test_id:response.data
                    });
                    displayMessage(" New Test Saved with Success !!");
                }else {
                    displayMessage(response.data.errorMessage);
                }
            });

        }else {
            alert("Vous devez Selectionner au moins une question");
        }
    }

    modifyTest(){
        let selectedmcqs=this.state.selectedmcqs;
        if(selectedmcqs.length>0){
            let selectedmcqs_ids=[];
            //gathering ids of  selected mcqs
            for (let mcq of selectedmcqs ){
                selectedmcqs_ids.push(mcq._id);
            }
            let dataTosend={
                document:{_id:this.state.test_id},
                updates:{
                    title:this.state.title,
                    reference:this.state.reference,
                    course_level:this.state.course_level,
                    selectedmcqs_ids:selectedmcqs_ids
                }
            };
            ServerService.postToServer('/mcquestions/modifyTest',dataTosend).then((response)=>{
                if(response.status===200){
                    displayMessage(" Test modified with Success !!");
                }else {
                    displayMessage(response.data.errorMessage);
                }
            });

        }else {
            alert("Vous devez Selectionner au moins une question");
        }
    }

    handleTitleChange(elt) {
        this.setState({
            title:elt.target.value
        });
    }

    setNewTest(){
        let originalmcqs=this.state.originalmcqs;
        this.setState({
            test_id:'',
            mcqs:originalmcqs
        });
    }

    displayTestButton(){
        if(this.state.test_id.length===0){
            return(
                <ButtonHelper
                    {
                        ...{
                            name:'validateTestCreation',
                            value:'Valider',
                            className:"form-helper-button success",
                        }
                    }
                    onClick={()=>this.createNewTest()}
                />
            );
        }else {
            return(
                <React.Fragment>
                    <ButtonHelper
                        {
                            ...{
                                name:'modifyTestButton',
                                value:'Modify',
                                className:"form-helper-button success",
                            }
                        }
                        onClick={()=>this.modifyTest()}
                    />
                    <ButtonHelper
                        {
                            ...{
                                name:'newTestButton',
                                value:'NewTest',
                                className:"form-helper-button success",
                            }
                        }
                        onClick={()=>this.setNewTest()}
                    />
                </React.Fragment>
            );
        }
    }

    render(){
        return(
            <React.Fragment>
                <div className={'test-creation-header'}>

                    {
                        this.displayTestButton()
                    }
                    <h2 >
                        Création d'Un Test
                    </h2>
                    <InputTextHelper {...{
                        name:"testName",
                        placeholder:"Titre Du Test",
                        className:"form-helper-input test-title-input"
                    }}
                    onChange={(e)=>{this.handleTitleChange(e)}}
                    />
                </div>
                <div className={"one-test-div"}>
                    <div className={"mcqs-list"}>
                        <h3> Liste Des QCMs </h3>
                        {
                            this.state.mcqs.map((mcq,key)=>{
                                return (
                                    <div className={'one-mcq-test-div'} key={key} onClick={()=>this.handleAddMCQS(mcq)}>
                                        {this.displayOneMCQ(mcq)}
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className={"selected-mcqs-list"}>
                        <h3> Liste Des QCMs Selectionnés </h3>
                        {
                            this.state.selectedmcqs.map((mcq,key)=>{
                                return(
                                        <div className={'one-mcq-test-div'} key={key} onClick={()=>this.handleRemoveMCQS(mcq)}>
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

class TestComponent extends Component{

    constructor(props){
        super(props);
        this.state={
            modalVisibility:false,
            modalChildren:'',
            reference:this.props.reference,
            course_level:this.props.course_level,
        }
    }

    buildTest(){
        let dataObjet={
            reference:this.state.reference,
            course_level:this.state.course_level
        };
        ServerService.postToServer('/mcquestions/getMCQsOfLevel',dataObjet).then((response)=>{
            if(response.status===200){
                console.log("list of MCQs Founded ",response.data);
                this.setState({
                    modalChildren:<OneTest
                        reference={this.state.reference}
                        course_level={this.state.course_level}
                        mcqs={response.data}
                    />,
                    modalVisibility:true,
                });
            }else{
                alert(response.data.errorMessage);
            }
        });
    }

    handleClose(){
        this.setState({
            modalVisibility:false,
            modalChildren:""
        });
    }

    listTests(){
        let dataObjet={
            reference:this.state.reference,
            course_level:this.state.course_level
        };
        ServerService.postToServer('/mcquestions/getTestsOfLevel',dataObjet).then((response)=>{
            if(response.status===200){
                console.log("list of Tests Founded ",response.data);
                this.setState({
                    modalChildren:<ListsTests
                        reference={this.state.reference}
                        course_level={this.state.course_level}
                        tests={response.data}
                        currentTest={response.data[0]||{}}
                    />,
                    modalVisibility:true,
                });
            }else{
                alert(response.data.errorMessage);
            }
        });
    }

    render(){
        return(
            <div>
                <ModalComponent visible={this.state.modalVisibility} onClose={()=>this.handleClose()}>
                    {this.state.modalChildren}
                    </ModalComponent>
                <ButtonHelper
                    {...{
                        name:'testConstructorButton',
                        value:'Produce A Test',
                        className:"form-helper-button warning produce-test-button"
                    }}
                    onClick={()=>this.buildTest()}
                />
                <ButtonHelper
                    {...{
                        name:'testsViewButton',
                        value:'List of Tests',
                        className:"form-helper-button warning produce-test-button"
                    }}
                    onClick={()=>this.listTests()}
                />

            </div>
        );
    }
}

export default TestComponent;