import React, {Component} from 'react';
import './mcqscomponent.css';
import {ButtonHelper, CheckBoxHelper, LabelHelper, RadioHelper} from "../HelperComponent/FormHelper";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import ReactQuill from 'react-quill'; // ES6
import {ServerService} from "../../server/ServerService";

class OneTest extends Component{
    constructor(props){
        super(props);
        this.state={
            course_reference:this.props.reference,
            mcqs:[],
            selectedMCQs:[]
        }
    }
    selectQuestion(mcq_id){
        let previousSelectedMCQs=this.state.selectedMCQs;
        previousSelectedMCQs.push(mcq_id);
        this.setState({
            selectedMCQs:previousSelectedMCQs
        });
    }
    displayOneMCQ(mcq,key){
        return(
            <div className={'one-mcq-test-div'} key={key}>
                <div>{mcq.question}</div>
                <div>
                    <CheckBoxHelper {...{
                        name:mcq._id,
                    }}
                    onChange={()=>this.selectQuestion(mcq._id)}
                    />
                </div>
            </div>)
    }

    render(){
        return(
            <div className={"mcqs-list"}>
                <div>List Of MCQS Available</div>

              {/*  {this.state.mcqs.map((mcq,key)=>{
                    this.displayOneMCQ(mcq,key);
                })}*/}
            </div>
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
            mcqs:[]
        }
    }

    buildTest(){
        this.setState({
            modalChildren:<OneTest reference={this.state.reference}/>,
            modalVisibility:true,
        });
    }
    handleClose(){
        this.setState({
            modalVisibility:false,
            modalChildren:""
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
                        className:"form-helper-button success"
                    }}
                    onClick={()=>this.buildTest()}
                    onClose={()=>this.handleClose()}
                />

            </div>
        );
    }
}
export default TestComponent;